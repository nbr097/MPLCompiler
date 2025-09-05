export const POST = async ({ request, platform }) => {
  const noStore = { 'cache-control': 'no-store', 'content-type': 'application/json' };

  try {
    const form = await request.formData();
    const file = form.get('file');
    const limitPages = form.get('limit_pages'); // optional
    if (!file) return new Response('No file', { status: 400, headers: noStore });

    const PARSER_URL = platform?.env?.PARSER_URL;
    if (!PARSER_URL) {
      return new Response(JSON.stringify({ error: 'PARSER_URL not configured' }), { status: 500, headers: noStore });
    }

    const url = new URL(PARSER_URL);
    if (limitPages && String(limitPages).trim() !== '') {
      url.searchParams.set('limit_pages', String(limitPages));
    }

    const fd = new FormData();
    fd.append('file', file, file.name || 'report.pdf');

    const headers = {};
    const token = platform?.env?.PARSER_TOKEN;
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const r = await fetch(url.toString(), { method: 'POST', body: fd, headers });
    const txt = await r.text();
    if (!r.ok) return new Response(txt || 'Parser error', { status: r.status, headers: noStore });

    // The parser already returns { rows: [...] }
    return new Response(txt, { headers: noStore });
  } catch (e) {
    return new Response(JSON.stringify({ error: e?.message || String(e) }), {
      status: 500, headers: noStore
    });
  }
};
