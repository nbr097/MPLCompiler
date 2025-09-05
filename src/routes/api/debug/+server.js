export const GET = async ({ platform }) => {
  const headers = { 'cache-control': 'no-store', 'content-type': 'application/json' };
  try {
    const PARSER_URL = platform?.env?.PARSER_URL || '';
    const PARSER_TOKEN = platform?.env?.PARSER_TOKEN || '';
    let health = { tried: false };

    if (PARSER_URL) {
      try {
        const u = new URL(PARSER_URL);
        // If PARSER_URL points to /parse, use /health for the ping
        const healthUrl = new URL(u);
        healthUrl.pathname = u.pathname.replace(/\/parse\/?$/, '/health');
        const r = await fetch(healthUrl.toString(), { method: 'GET' });
        const text = await r.text();
        health = { tried: true, url: healthUrl.toString(), status: r.status, body: text.slice(0, 300) };
      } catch (e) {
        health = { tried: true, error: String(e) };
      }
    }

    return new Response(JSON.stringify({
      ok: true,
      env_present: {
        PARSER_URL: Boolean(PARSER_URL),
        PARSER_TOKEN: Boolean(PARSER_TOKEN)
      },
      parser_url: PARSER_URL,
      health
    }, null, 2), { headers });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }, null, 2), { status: 500, headers });
  }
};
