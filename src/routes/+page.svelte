<script lang="ts">
  let provider: 'openai' | 'gemini' = 'openai'; // OpenAI is fully wired; Gemini optional later
  let file: File | null = null;
  let loading = false;
  let error = '';
  let rows: { article: string; description: string; mpl: number; soh: number }[] = [];

  async function submit() {
    if (!file) { error = 'Choose a file first.'; return; }
    loading = true; error = ''; rows = [];
    const fd = new FormData();
    fd.append('file', file);
    fd.append('provider', provider);

    const r = await fetch('/api/upload', { method: 'POST', body: fd });
    if (!r.ok) {
      error = (await r.text()) || 'Request failed';
    } else {
      const data = await r.json();
      rows = data.rows || [];
      if (!Array.isArray(rows)) rows = [];
    }
    loading = false;
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

<div style="max-width: 800px; margin: 2rem auto; padding: 1rem;">
  <h1 style="font-size:1.6rem; margin-bottom: 0.5rem;">Inventory PDF → Filtered Table</h1>
  <p style="margin:0 0 1rem 0; color:#444;">
    Upload a PDF/CSV/XLSX inventory report and get only the rows where <strong>SOH ≤ MPL</strong>.
  </p>

  <label style="display:block; margin: 0 0 0.5rem 0;">
    Provider:
    <select bind:value={provider}>
      <option value="openai">OpenAI (recommended)</option>
      <option value="gemini">Google Gemini (add later)</option>
    </select>
  </label>

  <input type="file" accept=".pdf,.csv,.xlsx" on:change={(e:any)=>file=e.currentTarget.files?.[0] ?? null} />

  <div style="margin-top:0.75rem;">
    <button on:click={submit} disabled={loading} style="padding:0.5rem 0.8rem;">
      {loading ? 'Processing…' : 'Upload & Extract'}
    </button>
  </div>

  {#if error}
    <p style="color:crimson; margin-top:0.75rem;">{error}</p>
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
