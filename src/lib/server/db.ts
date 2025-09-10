// src/lib/server/db.ts
import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const dataDir = '.data';
mkdirSync(dataDir, { recursive: true });

const db = new Database(join(dataDir, 'mpl.db'));
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS uploads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
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
);
CREATE INDEX IF NOT EXISTS idx_uploads_store ON uploads(store_number, store_name);
CREATE INDEX IF NOT EXISTS idx_uploads_created ON uploads(created_at);
`);

export function insertUpload(log: {
  filename?: string | null;
  store_number?: string | null;
  store_name?: string | null;
  pages_scanned?: number | null;
  pages_total?: number | null;
  rows_returned?: number | null;
  rows_considered?: number | null;
  limit_pages?: number | null;
  parser_url?: string | null;
  client_ip?: string | null;
}) {
  const stmt = db.prepare(`
    INSERT INTO uploads (
      filename, store_number, store_name,
      pages_scanned, pages_total, rows_returned, rows_considered,
      limit_pages, parser_url, client_ip
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    log.filename ?? null,
    log.store_number ?? null,
    log.store_name ?? null,
    log.pages_scanned ?? null,
    log.pages_total ?? null,
    log.rows_returned ?? null,
    log.rows_considered ?? null,
    log.limit_pages ?? null,
    log.parser_url ?? null,
    log.client_ip ?? null
  );
  return info.lastInsertRowid as number;
}

export function getSummary() {
  const totals = db.prepare(
    `SELECT COUNT(*) AS uploads, IFNULL(SUM(rows_returned),0) AS rows_returned FROM uploads`
  ).get();

  const byStore = db.prepare(`
    SELECT
      COALESCE(store_number,'') AS store_number,
      COALESCE(store_name,'')   AS store_name,
      COUNT(*)                  AS uploads,
      IFNULL(SUM(rows_returned),0) AS rows_returned,
      MIN(created_at)           AS first_upload,
      MAX(created_at)           AS last_upload
    FROM uploads
    GROUP BY store_number, store_name
    ORDER BY (store_number = '') ASC, store_number ASC, store_name ASC
  `).all();

  const recent = db.prepare(
    `SELECT * FROM uploads ORDER BY created_at DESC LIMIT 200`
  ).all();

  return { totals, byStore, recent };
}
