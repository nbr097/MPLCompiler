/** Returns the effective model this server will use */
export const GET = async ({ platform }) => {
  // read from env, with a clear default
  const model = platform?.env?.OPENAI_MODEL || 'gpt-5';
  return new Response(JSON.stringify({ model }), {
    headers: { 'content-type': 'application/json' }
  });
};
