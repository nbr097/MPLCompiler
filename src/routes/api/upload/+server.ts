// src/routes/api/upload/+server.js
//
// Cloudflare Pages Functions endpoint.
// - Forwards uploaded PDF to PARSER_URL (with ?limit_pages=...)
// - Returns parser JSON verbatim to the browser
// - Best-effort logs each upload to Cloudflare D1 (binding: DB)
// - Accepts optional store_number/store_name sent from the client (preferred)
// - Falls back to guessing store details from parser JSON
// - Uses D1-safe schema creation (prepare().run(), DEFAULT CURRENT_TIMESTAMP)

export const POST = async ({ request, platform }) => {
  const baseHeaders = { 'cache-control': 'no-store', 'content-type': 'application/json' };

  try {
    const form = await request.formData();
    const file = form.get('file');
    const limitPages = form.get('limit_pages');

    if (!(file instanceof File)) {
      return new Response(JSON.stringify({ error: 'No PDF file provided (expected form field "file")' }), {
        status: 400,
        headers: baseHeaders
      });
    }

    // ⬇️ NEW: pick up client-sent store fields (from PDF.js extraction in the UI)
    const storeNumberForm = (form.get('store_number') || '').toString().trim();
    const storeNameForm   = (form.get('store_name')   || '').toString().trim();

    const PARSER_URL = platform?.env?.PARSER_URL;
    if (!PARSER_URL) {
      return new Response(JSON.stringify({ error: 'PARSER_URL not configured' }), { status: 500, headers: baseHeaders });
    }

    // Build target URL; default to "0" = all pages
    const url = new URL(PARSER_URL);
    const limit = (limitPages && String(limitPages).trim() !== '') ? String(limitPages) : '0';
    url.searchParams.set('limit_pages', limit);

    // Re-buffer uploaded file (avoids edge cases in Workers runtime)
    const buf = await file.arrayBuffer();
    const freshFile = new File([buf], file.name || 'report.pdf', {
      type: file.type || 'application/pdf',
      lastModified: Date.now()
    });

    const fd = new FormData();
    fd.append('file', freshFile);

    // Authorization header (supports PARSER_TOKEN or PARSER_AUTH)
    const headers = {};
    const token = platform?.env?.PARSER_TOKEN || platform?.env?.PARSER_AUTH;
    if (token) headers['Authorization'] = String(token).startsWith('Bearer') ? String(token) : `Bearer ${token}`;

    // Optional timeout
    const timeoutMs = Number(platform?.env?.PARSER_TIMEOUT_MS) > 0 ? Number(platform.env.PARSER_TIMEOUT_MS) : 90_000;
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort('timeout'), timeoutMs);

    // Call the parser
    const r = await fetch(url.toString(), { method: 'POST', body: fd, headers, signal: ac.signal }).finally(() => clearTimeout(timer));
    const bodyText = await r.text();

    // Try to parse JSON for logging (always pass raw text back to client)
    let parsed = null;
    try { parsed = JSON.parse(bodyText || '{}'); } catch { /* keep null */ }

    // Best-effort store details: prefer client-provided, then guess from parser JSON
    const guess = guessStoreFromParsed(parsed);
    const store_number = storeNumberForm || guess.store_number || null;
    const store_name   = storeNameForm   || guess.store_name   || null;

    // Best-effort log to D1 (even on parser error so you can track attempts)
    await logUploadToD1({
      platform,
      filename: file.name || null,
      store_number,
      store_name,
      meta: parsed?.meta,
      rowsCount: Array.isArray(parsed?.rows) ? parsed.rows.length : null,
      limit_pages: Number.isFinite(Number(limit)) ? Number(limit) : null,
      parser_url: url.toString(),
      client_ip: getClientIp(request)
    });

    // Success → return parser body verbatim
    if (r.ok) {
      return new Response(bodyText || '{"rows":[]}', {
        status: 200,
        headers: {
          ...baseHeaders,
          'x-parser-status': String(r.status),
          'x-parser-url': url.toString()
        }
      });
    }

    // Non-200 → forward status & body so UI can show the real cause
    return new Response(bodyText || JSON.stringify({ error: 'Parser error (empty response body)' }), {
      status: r.status,
      headers: {
        ...baseHeaders,
        'x-parser-status': String(r.status),
        'x-parser-url': url.toString()
      }
    });

  } catch (e) {
    // Worker-side error before/around contacting parser
    return new Response(JSON.stringify({
      error: e?.message || String(e),
      hint: 'This error happened inside the Cloudflare worker (or a timeout) before returning to the client.'
    }), { status: 500, headers: baseHeaders });
  }
};

// Optional: GET handler
// - /api/upload?stats=1 → quick totals from D1 (proves binding works)
// - otherwise returns { ok: true, parser_url }
export const GET = async ({ request, platform }) => {
  const headers = { 'cache-control': 'no-store', 'content-type': 'application/json' };
  const url = new URL(request.url);

  if (url.searchParams.get('stats') && platform?.env?.DB) {
    try {
      await ensureSchema(platform.env.DB);
      const totals = await platform.env.DB.prepare(
        `SELECT COUNT(*) AS uploads, COALESCE(SUM(rows_returned),0) AS rows_returned FROM uploads`
      ).first();
      return new Response(JSON.stringify({ ok: true, totals, parser_url: platform?.env?.PARSER_URL || null }), { headers });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: String(e) }), { headers, status: 500 });
    }
  }

  return new Response(JSON.stringify({
    ok: true,
    parser_url: platform?.env?.PARSER_URL || null
  }), { headers });
};

/* ----------------------------- helpers ----------------------------- */

function getClientIp(request) {
  return (
    request.headers.get('cf-connecting-ip') ||
    (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
    null
  );
}

// Tries common shapes the parser might return; harmless if absent.
function guessStoreFromParsed(parsed) {
  if (!parsed) return { store_number: null, store_name: null };
  const meta = parsed.meta || {};
  const store = parsed.store || {};

  let store_number = store.number || meta.store_number || null;
  let store_name   = store.name   || meta.store_name   || null;

  // Fallback: try parsing a header-ish field if provided by parser
  const header = meta.header || meta.title || meta.report_header || '';
  if ((!store_number || !store_name) && typeof header === 'string' && header) {
    const reList = [
      /Store\s*#?\s*(\d{3,6})\s*[-–—]\s*([A-Za-z0-9 &'()./+-]+)/i,
      /Store\s*No\.?\s*(\d{3,6})\s*[:\-]?\s*([A-Za-z0-9 &'()./+-]+)/i,
      /([A-Za-z0-9 &'()./+-]+)\s*\(\s*Store\s*(\d{3,6})\s*\)/i,
      /([A-Za-z0-9 &'()./+-]+)\s*[-–—]\s*Store\s*(\d{3,6})/i
    ];
    for (const re of reList) {
      const m = re.exec(header);
      if (m) {
        const num = /\d/.test(m[1]) ? m[1] : m[2];
        const name = /\d/.test(m[1]) ? (m[2] || '') : (m[1] || '');
        store_number ||= num?.trim();
        store_name   ||= name?.trim();
        break;
      }
    }
  }

  return { store_number: store_number || null, store_name: store_name || null };
}

// Ensure schema using D1-friendly statements (no multi-statement exec, no functions in DEFAULT)
async function ensureSchema(DB) {
  await DB.prepare(
    `CREATE TABLE IF NOT EXISTS uploads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      filename TEXT,
      store_number TEXT,
      store_name TEXT,
      pages_scanned INTEGER,
      pages_total INTEGER,
      rows_returned INTEGER,
      rows_considered INTEGER,
      limit_pages INTEGER,
      parser_url TEXT,
      client_ip TEXT
    )`
  ).run();

  await DB.prepare(
    `CREATE INDEX IF NOT EXISTS idx_uploads_store
     ON uploads (store_number, store_name)`
  ).run();

  await DB.prepare(
    `CREATE INDEX IF NOT EXISTS idx_uploads_created
     ON uploads (created_at)`
  ).run();
}

async function logUploadToD1({
  platform,
  filename,
  store_number,
  store_name,
  meta,
  rowsCount,
  limit_pages,
  parser_url,
  client_ip
}) {
  const DB = platform?.env?.DB;
  if (!DB) return; // binding not present → skip

  try {
    await ensureSchema(DB);

    const pages_scanned   = Number.isFinite(Number(meta?.pages_scanned)) ? Number(meta.pages_scanned) : null;
    const pages_total     = Number.isFinite(Number(meta?.pages_total)) ? Number(meta.pages_total) : null;
    const rows_returned   = Number.isFinite(Number(meta?.rows_returned)) ? Number(meta.rows_returned) : (Number.isFinite(rowsCount) ? rowsCount : null);
    const rows_considered = Number.isFinite(Number(meta?.rows_considered)) ? Number(meta.rows_considered) : null;

    await DB.prepare(
      `INSERT INTO uploads (
        filename, store_number, store_name,
        pages_scanned, pages_total, rows_returned, rows_considered,
        limit_pages, parser_url, client_ip
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      filename ?? null,
      store_number ?? null,
      store_name ?? null,
      pages_scanned,
      pages_total,
      rows_returned,
      rows_considered,
      limit_pages ?? null,
      parser_url ?? null,
      client_ip ?? null
    ).run();
  } catch (e) {
    // Do not fail the request if logging fails
    console.error('D1 log insert failed:', e);
  }
}
