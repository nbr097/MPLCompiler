<script lang="ts">
  import { onMount } from 'svelte';

  type Row = { article: string; description: string; mpl: number; soh: number };

  let file: File | null = null;
  let rows: Row[] = [];
  let loading = false;
  let error = '';
  let limitPages: number | '' = 0; // 0 = all pages by default
  let lastParserURL = '';
  let lastStatus = 0;

  function withTimeout<T>(p: Promise<T>, ms = 90_000) {
    return Promise.race([
      p,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms)
      )
    ]);
  }

  async function submit() {
    if (!file) { error = 'Choose a file first.'; return; }
    loading = true; error = ''; rows = []; lastParserURL = ''; lastStatus = 0;

    const fd = new FormData();
    fd.append('file', file);
    // Always send limit_pages; 0 means "all pages"
    const lp = (limitPages === '' ? 0 : Number(limitPages));
    fd.append('limit_pages', String(isFinite(lp) ? lp : 0));

    try {
      const r = await withTimeout(fetch('/api/upload', { method: 'POST', body: fd }), 90_000);
      lastParserURL = r.headers.get('x-parser-url') || '';
      lastStatus = r.status;
      const txt = await r.text();
      if (!r.ok) {
        error = (txt || 'Request failed');
        return;
      }
      const data = JSON.parse(txt || '{}');
      rows = Array.isArray(data.rows) ? data.rows : [];
    } catch (e: any) {
      error = e?.message ?? 'Network error';
    } finally {
      loading = false;
    }
  }

  function copyTSV() {
    const header = 'Article\tDescription\tMPL\tSOH';
    const body = rows.map(r => `${r.article}\t${r.description}\t${r.mpl}\t${r.soh}`).join('\n');
    navigator.clipboard.writeText([header, body].join('\n'));
    alert('Copied as TSV for Google Sheets');
  }

  function downloadCSV() {
    const header = 'Article,Description,MPL,SOH';
    const esc = (s: string) => `"${(s || '').replace(/"/g, '""')}"`;
    const body = rows.map(r => [r.article, r.description, r.mpl, r.soh].map(v => esc(String(v))).join(',')).join('\n');
    const blob = new Blob([header + '\n' + body], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'soh_le_mpl.csv'; a.click();
    URL.revokeObjectURL(url);
  }
</script>

<div style="max-width: 900px; margin: 2rem auto; padding: 1rem;">
  <h1 style="font-size:1.6rem; margin:0 0 0.5rem 0;">Inventory PDF → Filtered Table</h1>
  <p style="margin:0 0 1rem 0; color:#444;">
    Upload a PDF and get only the rows where <strong>SOH ≤ MPL</strong>.
  </p>

  <label style="display:block; margin: 0 0 0.5rem 0;">
    Pages to scan (0 = all):
    <input type="number" min="0" step="1" bind:value={limitPages} style="max-width: 120px;" />
  </label>

  <input type="file" accept=".pdf" on:change={(e:any)=>{file=e.currentTarget.files?.[0]??null;}} />

  <div style="margin-top:0.75rem;">
    <button on:click={submit} disabled={loading} style="padding:0.5rem 0.8rem;">
      {loading ? 'Processing…' : 'Upload & Extract'}
    </button>
    {#if loading}
      <span style="margin-left: 8px; color:#666;">Parsing…</span>
    {/if}
  </div>

  {#if error}
    <div style="margin-top:0.75rem; padding:0.5rem; border:1px solid #f3b; background:#fff0f6;">
      <div style="font-weight:600; color:#b00; margin-bottom:4px;">Error</div>
      <pre style="white-space:pre-wrap; margin:0;">{error}</pre>
      {#if lastParserURL}
        <div style="color:#555; margin-top:6px; font-size:0.9rem;">Parser call: {lastParserURL}</div>
      {/if}
    </div>
  {/if}

  {#if !loading && !error && rows.length === 0}
    <div style="margin-top:0.75rem; padding:0.5rem; border:1px solid #ddd; background:#fafafa;">
      <strong>No rows matched (SOH ≤ MPL).</strong>
      <div style="color:#444; margin-top:4px;">
        Try increasing <em>Pages to scan</em> (set it to 0 to scan the whole PDF),
        or check that the PDF has rows where SOH is less than or equal to MPL on the scanned pages.
      </div>
    </div>
  {/if}

  {#if rows.length}
    <div style="display:flex; align-items:center; gap:0.75rem; margin-top:1rem;">
      <button on:click={copyTSV}>Copy TSV</button>
      <button on:click={downloadCSV}>Download CSV</button>
      <span style="color:#555;">{rows.length} row{rows.length === 1 ? '' : 's'}</span>
    </div>

    <div style="overflow:auto; margin-top:0.75rem;">
      <table border="1" cellpadding="6" style="border-collapse:collapse; min-width:700px;">
        <thead style="background:#f3f3f3;">
          <tr><th>Article</th><th>Description</th><th>MPL</th><th>SOH</th></tr>
        </thead>
        <tbody>
          {#each rows as r}
            <tr>
              <td>{r.article}</td>
              <td>{r.description}</td>
              <td>{r.soh}</td>
              <td>{r.mpl}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
