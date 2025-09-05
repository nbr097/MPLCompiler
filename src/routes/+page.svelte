<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  type Row = { article: string; description: string; soh: number; mpl: number };
  type Meta = {
    pages_total: number; pages_scanned: number; rows_returned: number;
    rows_considered: number; limit_pages: number; mode_used: string[]; scanned_image_pages: number;
  } | null;

  let file: File | null = null;
  let rows: Row[] = [];
  let meta: Meta = null;
  let loading = false;
  let error = '';
  let limitPages: number | '' = 0; // 0 = scan all pages
  let lastParserURL = '';
  let lastStatus = 0;

  // drag-anywhere overlay
  let dragging = false;
  let dragCounter = 0;

  function withTimeout<T>(p: Promise<T>, ms = 90_000) {
    return Promise.race([
      p,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms)
      )
    ]);
  }

  async function uploadAndExtract() {
    if (!file) { error = 'Choose or drop a PDF first.'; return; }
    loading = true; error = ''; rows = []; meta = null; lastStatus = 0; lastParserURL = '';

    const fd = new FormData();
    fd.append('file', file);
    const lp = (limitPages === '' ? 0 : Number(limitPages));
    fd.append('limit_pages', String(isFinite(lp) ? lp : 0));

    try {
      const r = await withTimeout(fetch('/api/upload', { method: 'POST', body: fd }), 90_000);
      lastParserURL = r.headers.get('x-parser-url') || '';
      lastStatus = r.status;
      const txt = await r.text();
      if (!r.ok) {
        error = txt || `HTTP ${r.status}`;
        return;
      }
      const data = JSON.parse(txt || '{}');
      rows = Array.isArray(data.rows) ? data.rows : [];
      meta = data.meta || null;
    } catch (e: any) {
      error = e?.message ?? 'Network error';
    } finally {
      loading = false;
    }
  }

  function copyTSV() {
    const header = 'Article\tDescription\tSOH\tMPL';
    const body = rows.map(r => `${r.article}\t${r.description}\t${r.soh}\t${r.mpl}`).join('\n');
    navigator.clipboard.writeText([header, body].join('\n'));
  }

  function downloadCSV() {
    const header = 'Article,Description,SOH,MPL';
    const esc = (s: string) => `"${(s || '').replace(/"/g, '""')}"`;
    const body = rows.map(r => [r.article, r.description, r.soh, r.mpl].map(v => esc(String(v))).join(',')).join('\n');
    const blob = new Blob([header + '\n' + body], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'soh_le_mpl.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  function onFileInput(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    file = target.files?.[0] ?? null;
  }

  // Drag-anywhere events (window-level)
  function onDragOver(e: DragEvent) {
    e.preventDefault();
    e.dataTransfer!.dropEffect = 'copy';
  }
  function onDragEnter(e: DragEvent) {
    e.preventDefault();
    dragCounter += 1;
    dragging = true;
  }
  function onDragLeave(e: DragEvent) {
    e.preventDefault();
    dragCounter -= 1;
    if (dragCounter <= 0) { dragging = false; dragCounter = 0; }
  }
  function onDrop(e: DragEvent) {
    e.preventDefault();
    dragging = false; dragCounter = 0;
    const f = e.dataTransfer?.files?.[0];
    if (f) {
      file = f;
      // auto-start
      uploadAndExtract();
    }
  }

  onMount(() => {
    window.addEventListener('dragover', onDragOver);
    window.addEventListener('dragenter', onDragEnter);
    window.addEventListener('dragleave', onDragLeave);
    window.addEventListener('drop', onDrop);
  });
  onDestroy(() => {
    window.removeEventListener('dragover', onDragOver);
    window.removeEventListener('dragenter', onDragEnter);
    window.removeEventListener('dragleave', onDragLeave);
    window.removeEventListener('drop', onDrop);
  });
</script>

<!-- Page shell -->
<div class="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">

  <!-- Drag overlay -->
  {#if dragging}
    <div class="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <div class="mx-6 rounded-2xl border-2 border-dashed border-white/70 bg-white/90 p-10 text-center shadow-xl">
        <div class="text-2xl font-semibold mb-2">Drop your PDF to upload</div>
        <div class="text-slate-600">We’ll scan it and list rows where <span class="font-semibold">SOH ≤ MPL</span>.</div>
      </div>
    </div>
  {/if}

  <header class="mx-auto max-w-5xl px-6 pt-10 pb-4">
    <h1 class="text-3xl font-bold tracking-tight">Inventory PDF → <span class="text-sky-600">Filtered Table</span></h1>
    <p class="mt-2 text-slate-600">Upload or drop a PDF and we’ll return only the rows where <span class="font-semibold">SOH ≤ MPL</span>.</p>
  </header>

  <main class="mx-auto max-w-5xl px-6 pb-16">
    <!-- Card -->
    <div class="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div class="p-6 space-y-6">

        <!-- Drop zone / chooser -->
        <div class="flex flex-col md:flex-row md:items-end gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-slate-700 mb-2">File</label>
            <label class="group relative flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 hover:border-sky-400 hover:bg-sky-50">
              <div class="flex items-center gap-3">
                <div class="rounded-lg bg-white p-2 shadow-sm ring-1 ring-slate-200">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 13h6m-6 4h6M3 7h6l2 2h10v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></svg>
                </div>
                <div>
                  <div class="text-slate-900 font-medium">Click to choose a PDF</div>
                  <div class="text-slate-500 text-sm">…or drop it anywhere on this page</div>
                </div>
              </div>
              <div class="text-xs text-slate-500">{file ? file.name : 'No file selected'}</div>
              <input class="absolute inset-0 opacity-0 cursor-pointer" type="file" accept=".pdf" on:change={onFileInput} />
            </label>
          </div>

          <div class="w-full md:w-44">
            <label class="block text-sm font-medium text-slate-700 mb-2">Pages to scan</label>
            <input type="number" min="0" step="1" bind:value={limitPages}
              class="block w-full rounded-lg border-slate-300 focus:border-sky-500 focus:ring-sky-500"
              placeholder="0 = all" />
          </div>

          <div class="w-full md:w-auto">
            <button
              on:click={uploadAndExtract}
              class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-3 text-white shadow hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading || !file}>
              {#if loading}
                <svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
                Processing…
              {:else}
                Upload & Extract
              {/if}
            </button>
          </div>
        </div>

        <!-- Error -->
        {#if error}
          <div class="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-800">
            <div class="font-semibold">Error</div>
            <pre class="mt-1 whitespace-pre-wrap text-sm">{error}</pre>
            {#if lastParserURL}
              <div class="mt-2 text-xs text-rose-700/80">Parser call: {lastParserURL}</div>
            {/if}
          </div>
        {/if}

        <!-- Empty state -->
        {#if !loading && !error && rows.length === 0}
          <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-700">
            <div class="font-medium">No rows matched (SOH ≤ MPL).</div>
            <div class="text-sm text-slate-600 mt-1">Try scanning more pages (set to <span class="font-semibold">0</span> to scan the whole PDF).</div>
          </div>
        {/if}

        <!-- Actions + meta -->
        {#if rows.length}
          <div class="flex flex-wrap items-center gap-3">
            <button on:click={copyTSV} class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50">Copy TSV</button>
            <button on:click={downloadCSV} class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50">Download CSV</button>
            <span class="text-sm text-slate-600">{rows.length} row{rows.length === 1 ? '' : 's'}</span>
            {#if meta}
              <span class="text-xs text-slate-500">• pages scanned: {meta.pages_scanned}/{meta.pages_total}</span>
              <span class="text-xs text-slate-500">• parser mode: {meta.mode_used?.join(', ')}</span>
            {/if}
          </div>

          <!-- Table -->
          <div class="overflow-auto rounded-xl border border-slate-200">
            <table class="min-w-[720px] w-full text-left">
              <thead class="bg-slate-100 text-slate-700 sticky top-0">
                <tr>
                  <th class="px-4 py-2 text-sm font-semibold">Article</th>
                  <th class="px-4 py-2 text-sm font-semibold">Description</th>
                  <th class="px-4 py-2 text-sm font-semibold">SOH</th>
                  <th class="px-4 py-2 text-sm font-semibold">MPL</th>
                </tr>
              </thead>
              <tbody class="[&>tr:nth-child(odd)]:bg-white [&>tr:nth-child(even)]:bg-slate-50">
                {#each rows as r}
                  <tr class="border-t border-slate-200">
                    <td class="px-4 py-2 font-medium tabular-nums">{r.article}</td>
                    <td class="px-4 py-2">{r.description}</td>
                    <td class="px-4 py-2 tabular-nums">{r.soh}</td>
                    <td class="px-4 py-2 tabular-nums">{r.mpl}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </div>

      <!-- footer info -->
      <div class="flex items-center justify-between border-t border-slate-200 px-6 py-4 text-xs text-slate-500">
        <div>Only rows with <span class="font-semibold">SOH ≤ MPL</span> are returned.</div>
        {#if lastStatus}
          <div>HTTP {lastStatus}</div>
        {/if}
      </div>
    </div>
  </main>
</div>
