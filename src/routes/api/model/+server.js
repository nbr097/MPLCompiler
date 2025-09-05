/** Returns the effective model for the given provider (or default). */
export const GET = async ({ platform, url }) => {
  const provider = (url.searchParams.get('provider') || 'openai').toLowerCase();
  let model = 'unknown';

  if (provider === 'gemini') {
    model = platform?.env?.GEMINI_MODEL || 'gemini-2.5-flash';
  } else {
    model = platform?.env?.OPENAI_MODEL || 'gpt-5-mini';
  }

  return new Response(JSON.stringify({ provider, model }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
  });
};
