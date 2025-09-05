// Disable server-side rendering for pages (avoids Worker SSR crashes on Pages)
// and prerender the static HTML. API routes under /api still run on the server.
export const ssr = false;
export const prerender = true;
