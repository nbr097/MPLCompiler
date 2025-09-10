import type { PageServerLoad } from './$types';

// Reads upload logs from Cloudflare D1 (binding: DB).
// Also disables caching so the Admin UI updates immediately after uploads.
export const load: PageServerLoad = async (event) => {
  // Prevent 304/etag reuse so the page data refreshes right after uploads
  event.setHeaders({ 'cache-control': 'no-store' });

  const DB = event.platform?.env?.DB;
  if (!DB) {
    return {
      summary: {
        totals: { uploads: 0, rows_returned: 0 },
        byStore: [],
        recent: []
      }
    };
  }

  await ensureSchema(DB);

  // Totals (works already because .first() returns a row)
  const totalsRow =
    (await DB.prepare(
      `SELECT COUNT(*) AS uploads, COALESCE(SUM(rows_returned),0) AS rows_returned FROM uploads`
    ).first<{ uploads: number; rows_returned: number }>()) ??
    { uploads: 0, rows_returned: 0 };

  // By store (use .all().results)
  const byStoreRes = await DB.prepare(
    `SELECT
        COALESCE(store_number,'') AS store_number,
        COALESCE(store_name,'')   AS store_name,
        COUNT(*)                  AS uploads,
        COALESCE(SUM(rows_returned),0) AS rows_returned,
        MIN(created_at)           AS first_upload,
        MAX(created_at)           AS last_upload
     FROM uploads
     GROUP BY store_number, store_name
     ORDER BY (store_number = '') ASC, store_number ASC, store_name ASC`
  ).all<{
    store_number: string;
    store_name: string;
    uploads: number;
    rows_returned: number;
    first_upload: string;
    last_upload: string;
  }>();
  const byStore = byStoreRes?.results ?? [];

  // Recent (use .all().results)
  const recentRes = await DB.prepare(
    `SELECT id, created_at, filename, store_number, store_name,
            pages_scanned, pages_total, rows_returned, rows_considered,
            limit_pages, parser_url, client_ip
     FROM uploads
     ORDER BY created_at DESC
     LIMIT 200`
  ).all();
  const recent = recentRes?.results ?? [];

  return {
    summary: {
      totals: totalsRow,
      byStore,
      recent
    }
  };
};

// D1-friendly schema creation (prepare().run(); DEFAULT CURRENT_TIMESTAMP)
async function ensureSchema(DB: D1Database) {
  await DB.prepare(
    `CREATE TABLE IF NOT EXISTS uploads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      filename TEXT,
      store_number TEXT,
      store_name TEXT,
      pages_scanned INTEGER,
      pages_total INTEGER,
      rows_returned INTEGER,
      rows_considered INTEGER,
      limit_pages INTEGER,
      parser_url TEXT,
      client_ip TEXT
    )`
  ).run();

  await DB.prepare(
    `CREATE INDEX IF NOT EXISTS idx_uploads_store
     ON uploads (store_number, store_name)`
  ).run();

  await DB.prepare(
    `CREATE INDEX IF NOT EXISTS idx_uploads_created
     ON uploads (created_at)`
  ).run();
}
