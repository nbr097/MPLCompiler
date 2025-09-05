// src/routes/api/upload/+server.js
export const POST = async ({ request, platform }) => {
  const baseHeaders = { 'cache-control': 'no-store', 'content-type': 'application/json' };

  try {
    const form = await request.formData();
    const file = form.get('file');
    const limitPages = form.get('limit_pages');

    if (!(file instanceof File)) {
      return new Response(JSON.stringify({ error: 'No PDF file provided (expected form field "file")' }), {
        status: 400, headers: baseHeaders
      });
    }

    const PARSER_URL = platform?.env?.PARSER_URL;
    if (!PARSER_URL) {
      return new Response(JSON.stringify({ error: 'PARSER_URL not configured' }), { status: 500, headers: baseHeaders });
    }

    // Build target URL; default to "0" = all pages
    const url = new URL(PARSER_URL);
    const limit = (limitPages && String(limitPages).trim() !== '') ? String(limitPages) : '0';
    url.searchParams.set('limit_pages', limit);

    // 🔧 Re-buffer the uploaded file to avoid locked/streamed File edge cases in Workers
    const buf = await file.arrayBuffer();
    const freshFile = new File([buf], file.name || 'report.pdf', {
      type: file.type || 'application/pdf',
      lastModified: Date.now()
    });

    const fd = new FormData();
    fd.append('file', freshFile);

    const headers = {};
    const token = platform?.env?.PARSER_TOKEN;
    if (token) headers['Authorization'] = `Bearer ${token}`;

    // Do the call
    const r = await fetch(url.toString(), {
      method: 'POST',
      body: fd,
      headers
    });

    const bodyText = await r.text();

    if (r.ok) {
      // Parser returns JSON text; pass through verbatim
      return new Response(bodyText || '{"rows":[]}', {
        status: 200,
        headers: {
          ...baseHeaders,
          'x-parser-status': String(r.status),
          'x-parser-url': url.toString()
        }
      });
    }

    // Non-200 from parser → forward status and body so UI can show the real cause
    return new Response(bodyText || JSON.stringify({ error: 'Parser error (empty response body)' }), {
      status: r.status,
      headers: {
        ...baseHeaders,
        'x-parser-status': String(r.status),
        'x-parser-url': url.toString()
      }
    });

  } catch (e) {
    // Catch unexpected worker-side issues (e.g., TypeError from FormData/File)
    return new Response(JSON.stringify({
      error: e?.message || String(e),
      hint: 'This error happened inside the Cloudflare worker before contacting the parser.'
    }), { status: 500, headers: baseHeaders });
  }
};

// Optional: quick GET to confirm env from the browser (kept separate from /api/debug)
export const GET = async ({ platform }) => {
  const headers = { 'cache-control': 'no-store', 'content-type': 'application/json' };
  return new Response(JSON.stringify({
    ok: true,
    parser_url: platform?.env?.PARSER_URL || null
  }), { headers });
};
