import OpenAI from 'openai'; // used only when provider='openai'

/* ---------------- Shared parsing helpers ---------------- */

function cleanDescription(desc) {
  if (!desc || typeof desc !== 'string') return '';
  const cleaned = desc.replace(/^[A-Z]{1,3}\s+(?=[A-Za-z0-9])/u, ''); // drop "PI ", "WW ", etc.
  return cleaned.trim().replace(/\s{2,}/g, ' ');
}
function toInt(n) {
  if (n === null || n === undefined) return 0;
  const x = parseInt(String(n).replace(/[, ]/g, ''), 10);
  return Number.isFinite(x) ? x : 0;
}
/** Prefer header-anchored MPL/SOH if headers look correct; else fall back to rightmost trio. */
function chooseFinalPair(row) {
  const mh = (row.mpl_header || '').toString().trim().toUpperCase();
  const sh = (row.soh_header || '').toString().trim().toUpperCase();

  const headerLooksRight = (mh === 'MPL' && sh === 'SOH');

  const h_mpl = toInt(row.mpl);
  const h_soh = toInt(row.soh);
  const t_mpl = toInt(row.tail_mpl);
  const t_soh = toInt(row.tail_soh);
  const t_cap = toInt(row.tail_capacity);

  const headerLooksSwapped =
    (h_mpl === t_cap && t_mpl !== t_cap) ||
    (h_mpl === t_soh && h_soh === t_mpl);

  const headerUsable = headerLooksRight && !headerLooksSwapped && !(h_mpl === 0 && t_mpl > 0);

  if (headerUsable) return { mpl: h_mpl, soh: h_soh };
  return { mpl: t_mpl, soh: t_soh };
}

/* --------------- Structured output schemas --------------- */
/** OpenAI JSON Schema (allowing additionalProperties: false is fine here) */
const openAISchema = {
  type: 'object',
  properties: {
    rows: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          article: { type: 'string' },
          description: { type: 'string' },
          mpl: { type: 'number' },
          soh: { type: 'number' },
          mpl_header: { type: 'string' },
          soh_header: { type: 'string' },
          tail_soh: { type: 'number' },
          tail_mpl: { type: 'number' },
          tail_capacity: { type: 'number' },
          raw_row: { type: 'string' }
        },
        required: [
          'article','description','mpl','soh',
          'mpl_header','soh_header',
          'tail_soh','tail_mpl','tail_capacity',
          'raw_row'
        ],
        additionalProperties: false
      }
    }
  },
  required: ['rows'],
  additionalProperties: false
};

/** Gemini uses an OpenAPI-Subset "Schema" (keep it simple; no additionalProperties) */
const geminiSchema = {
  type: 'object',
  properties: {
    rows: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          article: { type: 'string' },
          description: { type: 'string' },
          mpl: { type: 'integer' },
          soh: { type: 'integer' },
          mpl_header: { type: 'string' },
          soh_header: { type: 'string' },
          tail_soh: { type: 'integer' },
          tail_mpl: { type: 'integer' },
          tail_capacity: { type: 'integer' },
          raw_row: { type: 'string' }
        },
        required: [
          'article','description','mpl','soh',
          'mpl_header','soh_header',
          'tail_soh','tail_mpl','tail_capacity',
          'raw_row'
        ]
      }
    }
  },
  required: ['rows']
};

/* --------------- Prompts --------------- */

const baseSystem = `
You are a precise inventory table parser. Do NOT guess; follow these rules exactly.

Headers & mapping (PRIMARY SOURCE):
- Read MPL strictly from the column with header text exactly "MPL".
- Read SOH strictly from the column with header text exactly "SOH".
- Never use "Capacity"/"Capcity" or "OM" for MPL or SOH.

Right-edge trio (SECONDARY SOURCE for validation only):
- At the far right of each row there are three numeric cells in left→right order:
  [ SOH , MPL , Capacity ] (Capacity may appear as "Capcity").
- Extract those into tail_soh, tail_mpl, tail_capacity.

For each row output:
- article (ID), description (clean; remove leading supplier prefixes like "PI ")
- mpl, soh (ints) from the PRIMARY headers
- mpl_header, soh_header (exact header strings used)
- tail_soh, tail_mpl, tail_capacity (ints) from the rightmost trio
- raw_row (verbatim text of that row)

Integers only; blank numeric cells become 0. No totals/footers/headers.
`;

const baseUser = `
Task: Extract rows per the rules. Return JSON matching the schema exactly.
`;

/* --------------- Utils --------------- */

function withAbort(ms) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort('timeout'), ms);
  return { signal: ctrl.signal, done: () => clearTimeout(id) };
}

/* --------------- Endpoint --------------- */

export const POST = async ({ request, platform }) => {
  const noStore = { 'cache-control': 'no-store', 'content-type': 'application/json' };

  try {
    const form = await request.formData();
    const provider = (form.get('provider') || 'openai').toString();
    const file = form.get('file');
    const limitPages = Number(form.get('limit_pages') || 3); // default to first 3 pages for speed

    if (!file) return new Response('No file', { status: 400, headers: noStore });

    const pageNote = limitPages > 0
      ? `IMPORTANT: Only read the FIRST ${limitPages} pages of the document and ignore all later pages.`
      : '';

    /* ---------------- Gemini path ---------------- */
    if (provider === 'gemini') {
      const GEMINI_API_KEY = platform?.env?.GEMINI_API_KEY;
      const GEMINI_MODEL = platform?.env?.GEMINI_MODEL || 'gemini-2.5-flash';
      if (!GEMINI_API_KEY) {
        return new Response(JSON.stringify({ error: 'Missing GEMINI_API_KEY' }), { status: 500, headers: noStore });
      }

      // size guard
      const MAX_BYTES = Number(platform?.env?.MAX_UPLOAD_BYTES) || 10 * 1024 * 1024; // 10MB default
      if (typeof file.size === 'number' && file.size > MAX_BYTES) {
        return new Response(JSON.stringify({ error: `File too large (${file.size} bytes). Limit is ${MAX_BYTES} bytes.` }), {
          status: 413, headers: noStore
        });
      }

      const REQUEST_TIMEOUT_MS = Number(platform?.env?.GEMINI_REQUEST_TIMEOUT_MS) || 120_000;

      // 1) Resumable upload to Files API
      const startMeta = {
        method: 'POST',
        headers: {
          'X-Goog-Upload-Protocol': 'resumable',
          'X-Goog-Upload-Command': 'start',
          'X-Goog-Upload-Header-Content-Length': String(file.size || 0),
          'X-Goog-Upload-Header-Content-Type': file.type || 'application/pdf',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ file: { display_name: file.name || 'report.pdf' } })
      };
      const { signal: s1, done: d1 } = withAbort(REQUEST_TIMEOUT_MS);
      let uploadURL = '';
      try {
        const r1 = await fetch(`https://generativelanguage.googleapis.com/upload/v1beta/files?key=${GEMINI_API_KEY}`, { ...startMeta, signal: s1 });
        d1();
        if (!r1.ok) {
          const txt = await r1.text();
          return new Response(txt || 'Failed to start upload', { status: r1.status, headers: noStore });
        }
        uploadURL = r1.headers.get('X-Goog-Upload-URL') || r1.headers.get('x-goog-upload-url') || '';
        if (!uploadURL) {
          return new Response(JSON.stringify({ error: 'No resumable upload URL from Gemini' }), { status: 502, headers: noStore });
        }
      } catch (err) {
        d1();
        throw err;
      }

      // 2) Upload bytes & finalize
      const { signal: s2, done: d2 } = withAbort(REQUEST_TIMEOUT_MS);
      let fileInfo;
      try {
        const r2 = await fetch(uploadURL, {
          method: 'POST',
          headers: {
            'Content-Length': String(file.size || 0),
            'X-Goog-Upload-Offset': '0',
            'X-Goog-Upload-Command': 'upload, finalize',
            'Content-Type': file.type || 'application/pdf'
          },
          body: file,
          signal: s2
        });
        d2();
        if (!r2.ok) {
          const txt = await r2.text();
          return new Response(txt || 'Upload finalize failed', { status: r2.status, headers: noStore });
        }
        fileInfo = await r2.json().catch(() => ({}));
      } catch (err) {
        d2();
        throw err;
      }

      const fileUri = fileInfo?.file?.uri;
      const fileName = fileInfo?.file?.name; // e.g., "files/abc-123"
      if (!fileUri) {
        return new Response(JSON.stringify({ error: 'Upload succeeded but no file URI returned' }), { status: 502, headers: noStore });
      }

      // 3) Generate structured output
      const systemPrompt = baseSystem + '\n' + pageNote;
      const userPrompt = baseUser + '\n' + pageNote;

      const body = {
        contents: [{
          role: 'user',
          parts: [
            { text: systemPrompt + '\n' + userPrompt },
            { file_data: { file_uri: fileUri, mime_type: file.type || 'application/pdf' } }
          ]
        }],
        generationConfig: {
          // Deterministic, JSON-only output per schema
          responseMimeType: 'application/json',
          responseSchema: geminiSchema
        }
      };

      const { signal: s3, done: d3 } = withAbort(REQUEST_TIMEOUT_MS);
      let genJson = {};
      try {
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: s3
        });
        d3();
        const txt = await r.text();
        if (!r.ok) {
          return new Response(txt || 'Gemini generateContent failed', { status: r.status, headers: noStore });
        }
        // Gemini wraps your JSON in candidates[].content.parts[].text
        const parsed = JSON.parse(txt);
        const text = parsed?.candidates?.[0]?.content?.parts?.find?.(p => 'text' in p)?.text || '';
        genJson = text ? JSON.parse(text) : { rows: [] };
      } catch (err) {
        d3();
        throw err;
      } finally {
        // Best-effort cleanup: delete file so it doesn't linger (optional)
        if (fileName) {
          try {
            const { signal, done } = withAbort(10_000);
            await fetch(`https://generativelanguage.googleapis.com/v1beta/${fileName}?key=${GEMINI_API_KEY}`, {
              method: 'DELETE', signal
            });
            done();
          } catch { /* ignore */ }
        }
      }

      // 4) Finalize rows
      const finalRows = (Array.isArray(genJson.rows) ? genJson.rows : [])
        .map((r) => {
          const { mpl, soh } = chooseFinalPair(r);
          return {
            article: String(r.article ?? '').trim(),
            description: cleanDescription(r.description),
            mpl,
            soh
          };
        })
        .filter(r => r.article && r.soh <= r.mpl);

      return new Response(JSON.stringify({ model: GEMINI_MODEL, rows: finalRows }), { headers: noStore });
    }

    /* ---------------- OpenAI path (unchanged from your working version, kept for parity) ---------------- */

    const apiKey = platform?.env?.OPENAI_API_KEY;
    if (!apiKey) return new Response('Missing OPENAI_API_KEY', { status: 500, headers: noStore });

    const model = platform?.env?.OPENAI_MODEL || 'gpt-5-mini';
    const baseURL = platform?.env?.OPENAI_BASE_URL;
    const REQUEST_TIMEOUT_MS = Number(platform?.env?.OPENAI_REQUEST_TIMEOUT_MS) || 120_000;
    const MAX_BYTES = Number(platform?.env?.MAX_UPLOAD_BYTES) || 10 * 1024 * 1024;

    if (typeof file.size === 'number' && file.size > MAX_BYTES) {
      return new Response(JSON.stringify({ error: `File too large (${file.size} bytes). Limit is ${MAX_BYTES} bytes.` }), {
        status: 413, headers: noStore
      });
    }

    const openai = new OpenAI({ apiKey, baseURL, timeout: REQUEST_TIMEOUT_MS, maxRetries: 0 });

    // Upload
    let uploaded = null;
    try {
      uploaded = await openai.files.create({ file, purpose: 'assistants' });

      // Generate
      const systemPrompt = baseSystem + '\n' + pageNote;
      const userPrompt = baseUser + '\n' + pageNote;

      const resp = await openai.responses.create({
        model,
        input: [
          { role: 'system', content: [{ type: 'input_text', text: systemPrompt }] },
          {
            role: 'user',
            content: [
              { type: 'input_text', text: userPrompt },
              { type: 'input_file', file_id: uploaded.id }
            ]
          }
        ],
        text: {
          format: { type: 'json_schema', name: 'InventoryRows', schema: openAISchema, strict: true }
        }
      });

      let outStr = resp?.output_text;
      if (!outStr) {
        try {
          const first = resp?.output?.[0]?.content?.find?.(p => p.type === 'output_text');
          if (first?.text) outStr = first.text;
        } catch { /* noop */ }
      }
      if (!outStr) outStr = JSON.stringify({ rows: [] });

      let data = {};
      try { data = JSON.parse(outStr); } catch { data = { rows: [] }; }

      const finalRows = (Array.isArray(data.rows) ? data.rows : [])
        .map((r) => {
          const { mpl, soh } = chooseFinalPair(r);
          return {
            article: String(r.article ?? '').trim(),
            description: cleanDescription(r.description),
            mpl,
            soh
          };
        })
        .filter(r => r.article && r.soh <= r.mpl);

      return new Response(JSON.stringify({ model, rows: finalRows }), { headers: noStore });

    } finally {
      if (uploaded?.id) { try { await openai.files.del(uploaded.id); } catch {} }
    }

  } catch (e) {
    const status =
      (e && typeof e === 'object' && 'status' in e && e.status) ? e.status :
      (String(e).toLowerCase().includes('timeout') ? 504 : 500);

    const body = (() => {
      try { return JSON.stringify({ error: (e?.message || String(e)) }); }
      catch { return JSON.stringify({ error: 'Server error' }); }
    })();

    return new Response(body, { status, headers: { 'cache-control': 'no-store', 'content-type': 'application/json' } });
  }
};
