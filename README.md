# MPLCompiler
Upload an Inventory PDF and have the data scraped for easy read and check

# Inventory Parser (Cloudflare Pages + SvelteKit)

- Upload an inventory PDF/CSV/XLSX.
- Server calls python script with pdfplumber to scrape relevant data.
- Returns only rows where **SOH ≤ MPL** as `{ rows: [...] }`.

## Env vars (Cloudflare Pages → Settings → Environment variables)
- PARSER_URL = https://inventory-pdf-parser.fly.dev/parse

## Local dev (optional)
npm i
npm run dev
# For a Pages-like dev server you can also:
# npx wrangler pages dev .svelte-kit/cloudflare
