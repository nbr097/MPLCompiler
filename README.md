# MPLCompiler
Upload an Inventory PDF and have the data scraped for easy read and check

# Inventory Parser (Cloudflare Pages + SvelteKit)

- Upload an inventory PDF/CSV/XLSX.
- Server calls OpenAI with Structured Outputs.
- Returns only rows where **SOH ≤ MPL** as `{ rows: [...] }`.

## Env vars (Cloudflare Pages → Settings → Environment variables)
- OPENAI_API_KEY = sk-...
- OPENAI_MODEL = gpt-4o-mini  (default if not set)

## Local dev (optional)
npm i
npm run dev
# For a Pages-like dev server you can also:
# npx wrangler pages dev .svelte-kit/cloudflare
