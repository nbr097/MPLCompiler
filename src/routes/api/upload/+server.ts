export const POST = async ({ request, platform }) => {
  const baseHeaders = { 'cache-control': 'no-store', 'content-type': 'application/json' };

  try {
    const form = await request.formData();
    const file = form.get('file');
    const limitPages = form.get('limit_pages'); // may be empty/undefined

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400, headers: baseHeaders });
    }

    const PARSER_URL = platform?.env?.PARSER_URL;
    if (!PARSER_URL) {
      return new Response(JSON.stringify({ error: 'PARSER_URL not configured in environment' }), { status: 500, headers: baseHeaders });
    }

    // Build target URL and ALWAYS include limit_pages (default 0 = all pages)
    const url = new URL(PARSER_URL);
    const limit = (limitPages && String(limitPages).trim() !== '') ? String(limitPages) : '0';
    url.searchParams.set('limit_pages', limit);

    // Build form body
    const fd = new FormData();
    fd.append('file', file, file.name || 'report.pdf');

    // Optional bearer auth to parser
    const headers = {};
    const token = platform?.env?.PARSER_TOKEN;
    if (token) headers['Authorization'] = `Bearer ${token}`;

    // Call the parser
    const r = await fetch(url.toString(), { method: 'POST', body: fd, headers });
    const bodyText = await r.text();

    // Pass-through on success
    if (r.ok) {
      // Parser returns {"rows":[...]} (and possibly "meta" if you added it)
      return new Response(bodyText || '{"rows":[]}', {
        status: 200,
        headers: {
          ...baseHeaders,
          'x-parser-status': String(r.status),
          'x-parser-url': url.toString()
        }
      });
    }

    // Forward parser error status and body so the UI can show it verbatim
    return new Response(bodyText || JSON.stringify({ error: 'Parser error (empty response body)' }), {
      status: r.status,
      headers: {
        ...baseHeaders,
        'x-parser-status': String(r.status),
        'x-parser-url': url.toString()
      }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e?.message || String(e) }), {
      status: 500,
      headers: baseHeaders
    });
  }
};
