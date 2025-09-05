<script lang="ts">
  import { onMount } from 'svelte';

  type Row = { article: string; description: string; mpl: number; soh: number };

  let provider: 'openai' | 'gemini' = 'openai';
  let file: File | null = null;
  let rows: Row[] = [];
  let loading = false;
  let error = '';
  let model = 'loading…';
  let limitPages: number | '' = 3; // first N pages ('' = no cap)

  async function fetchModel(p = provider) {
    model = 'checking…';
    try {
      const r = await fetch(`/api/model?provider=${encodeURIComponent(p)}`, { cache: 'no-store' });
      if (r.ok) {
        const d = await r.json();
        model = d.model || 'unknown';
      } else {
        model = 'unknown';
      }
    } catch {
      model = 'unknown';
    }
  }

  onMount(fetchModel);
  $: fetchModel(provider); // update badge whenever selector changes

  function withTimeout<T>(p: Promise<T>, ms = 130_000) {
    return Promise.race([
      p,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms)
      )
    ]);
  }

  async function submit() {
    if (!file) { error = 'Choose a file first.'; return; }
    loading = true; error = ''; rows = [];

    const fd = new FormData();
    fd.append('file', file);
    fd.append('provider', provider);
    if (limitPages !== '' && isFinite(+limitPages) && +limitPages > 0) {
      fd.append('limit_pages', String(+limitPages));
    }

    try {
      const r = await withTimeout(fetch('/api/upload', { method: 'POST', body: fd }), 130_000);
      const txt = await r.text();
      if (!r.ok) {
        error = txt || 'Request failed';
        return;
      }
      const data = JSON.parse(txt || '{}');
      rows = Array.isArray(data.rows) ? data.rows : [];
      if (data.model) model = data.model; // refresh badge from server response
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
  <div style="display:flex; align-items:center; justify-content:space-between; gap:1rem; margin-bottom: 0.5rem;">
    <h1 style="font-size:1.6rem; margin:0;">Inventory PDF → Filtered Table</h1>
    <span title="Model used by server"
      style="font: 500 0.9rem/1.2 system-ui, sans-serif; padding: 6px 10px; border-radius: 999px; border: 1px solid #ddd;">
      Model: <strong>{model}</strong> &nbsp;<small>({provider})</small>
    </span>
  </div>

  <p style="margin:0 0 1rem 0; color:#444;">
    Upload a PDF/CSV/XLSX and get only the rows where <strong>SOH ≤ MPL</strong>.
  </p>

  <label style="display:block; margin: 0 0 0.5rem 0;">
    Provider:
    <select bind:value={provider}>
      <option value="openai">OpenAI</option>
      <option value="gemini">Google Gemini</option>
    </select>
  </label>

  <label style="display:block; margin: 0 0 0.5rem 0;">
    Pages to scan (optional):
    <input type="number" min="1" step="1" bind:value={limitPages} placeholder="e.g. 3" style="max-width: 100px;" />
    <small style="color:#666; margin-left:8px;">Keeps runs fast on big PDFs</small>
  </label>

  <input type="file" accept=".pdf,.csv,.xlsx" on:change={(e:any)=>{file=e.currentTarget.files?.[0]??null;}} />

  <div style="margin-top:0.75rem;">
    <button on:click={submit} disabled={loading} style="padding:0.5rem 0.8rem;">
      {loading ? 'Processing…' : 'Upload & Extract'}
    </button>
    {#if loading}
      <span style="margin-left: 8px; color:#666;">Large PDFs may take a bit.</span>
    {/if}
  </div>

  {#if error}
    <p style="color:crimson; margin-top:0.75rem; white-space: pre-wrap;">{error}</p>
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
              <td>{r.mpl}</td>
              <td>{r.soh}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
