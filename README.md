# MPLCompiler — Inventory Filter & Label Printer 😊

A tiny SvelteKit app that ingests a store report (PDF), extracts only the items where **SOH ≤ MPL**, and gives you clean outputs:

- A sortable results table (with **Code 39 barcodes** for each article)
- One-click **CSV/TSV export** (If you remove the comments)
- A dedicated **Labels** page with:
  - Live **column count** control (1–6 columns on A4)
  - **Auto-fitting barcodes** that scale to each label’s width
  - Print-friendly layout (A4 by default)
- **Dark mode** toggle
- **Drag-and-drop** upload anywhere on the page
- **State persistence** (results survive Back/reload and can open Labels in a new tab)

---

## Demo (flow)
1. Upload or drop a PDF report.
2. The app extracts rows where `SOH ≤ MPL`.
3. Review the table (barcodes are shown under each article).
4. Export CSV/TSV or click **Print labels** → opens `/labels` in a new tab.
5. On the Labels page, adjust **Columns** (1–6); barcodes resize to fit; click **Print**.

> Tip: If your browser blocks pop-ups, allow the site when you click **Print labels** (it opens `/labels` in a new tab).

---

## Tech Stack

- **SvelteKit** (Vite)
- **Tailwind-style utility classes** in markup
- **Libre Barcode 39** (Google Fonts) for Code 39 barcodes
- Minimal server endpoint: `POST /api/upload` (parses the PDF and returns JSON)

---

## Getting Started

### Prerequisites
- **Node.js 18+** (20+ recommended)
- **npm** or **pnpm** or **yarn**

### Install & Run

```bash
# clone
git clone https://github.com/nbr097/MPLCompiler.git
cd MPLCompiler

# install deps
npm i
# or: pnpm i / yarn

# dev
npm run dev
# open the printed localhost URL