<script lang="ts">
  import { onMount } from 'svelte';

  let provider: 'openai' | 'gemini' = 'openai';
  let file: File | null = null;
  let rows: { article: string; description: string; mpl: number; soh: number }[] = [];
  let loading = false;
  let error = '';
  let model = 'loading…';

  onMount(async () => {
    try {
      const r = await fetch('/api/model');
      if (r.ok) {
        const d = await r.json();
        model = d.model || 'unknown';
      } else {
        model = 'unknown';
      }
    } catch {
      model = 'unknown';
    }
  });

  async function submit() {
    if (!file) { error = 'Choose a file first.'; return; }
    loading = true; error = ''; rows = [];
    const fd = new FormData();
    fd.append('file', file);
    fd.append('provider', provider);

    try {
      const r = await fetch('/api/upload', { method: 'POST', body: fd });
      const txt = await r.text();
      if (!r.ok) {
        error = txt || 'Request failed';
        loading = false;
        return;
      }
      const data = JSON.parse(txt || '{}');
      rows = Array.isArray(data.rows) ? data.rows : [];
      // if the server echoed the model, update the badge (useful if you change it between deploys)
      if (data.model) model = data.model;
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
    const esc = (s:string)=> `"${(s||'').replace(/"/g,'""')}"`;
    const body = rows.map(r => [r.article, r.description, r.mpl, r.soh].map(v=>esc(String(v))).join(',')).join('\n');
    const blob = new Blob([header+'\n'+body], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'soh_le_mpl.csv'; a.click();
    URL.revokeObjectURL(url);
  }
</script>

<div style="max-width: 900px; margin: 2rem auto; padding: 1rem;">
  <div style="display:flex; align-items:center; justify-content:space-between; gap:1rem; margin-bottom: 0.5rem;">
    <h1 style="font-size:1.6rem; margin:0;">Inventory PDF → Filtered Table</h1>
    <span
      title="Model used by server"
      style="font: 500 0.9rem/1.2 system-ui, sans-serif; padding: 6px 10px; border-radius: 999px; border: 1px solid #ddd;">
      Model: <strong>{model}</strong>
    </span>
  </div>

  <p style="margin:0 0 1rem 0; color:#444;">
    Upload a PDF/CSV/XLSX and get only the rows where <strong>SOH ≤ MPL</strong>.
  </p>

  <label style="display:block; margin: 0 0 0.5rem 0;">
    Provider:
    <select bind:value={provider}>
      <option value="openai">OpenAI</option>
      <option value="gemini">Google Gemini (disabled)</option>
    </select>
  </label>

  <input type="file" accept=".pdf,.csv,.xlsx" on:change={(e:any)=>file=e.currentTarget.files?.[0] ?? null} />

  <div style="margin-top:0.75rem;">
    <button on:click={submit} disabled={loading} style="padding:0.5rem 0.8rem;">
      {loading ? 'Processing…' : 'Upload & Extract'}
    </button>
  </div>

  {#if error}
    <p style="color:crimson; margin-top:0.75rem; white-space: pre-wrap;">{error}</p>
  {/if}

  {#if rows.length}
    <div style="display:flex; gap:0.5rem; margin-top:1rem;">
      <button on:click={copyTSV}>Copy TSV</button>
      <button on:click={downloadCSV}>Download CSV</button>
    </div>

    <div style="overflow:auto; margin-top:0.75rem;">
      <table border="1" cellpadding="6" style="border-collapse:collapse; min-width:600px;">
        <thead style="background:#f3f3f3;">
          <tr>
            <th>Article</th>
            <th>Description</th>
            <th>MPL</th>
            <th>SOH</th>
          </tr>
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
