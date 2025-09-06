<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  // ---------- Types ----------
  type Row = { article: string; description: string; soh: number; mpl: number };
  type Meta = {
    pages_total: number; pages_scanned: number; rows_returned: number;
    rows_considered: number; limit_pages: number; mode_used: string[]; scanned_image_pages: number;
  } | null;

  // ---------- Storage keys ----------
  const STORAGE_ROWS_KEY = 'mpl_rows_v1';
  const STORAGE_META_KEY = 'mpl_meta_v1';

  // ---------- State ----------
  let file: File | null = null;
  let rows: Row[] = [];
  let meta: Meta = null;
  let loading = false;
  let error = '';
  let limitPages: number | '' = 0; // 0 = all pages
  let lastParserURL = '';
  let lastStatus = 0;

  // drag-anywhere overlay
  let dragging = false;
  let dragCounter = 0;

  // theme
  let dark = false;
  onMount(() => {
    const saved = localStorage.getItem('theme');
    dark = saved ? saved === 'dark' : window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    applyTheme();

    // Restore previously extracted data so Back/reload shows the same table
    restoreState();

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
  function applyTheme() {
    const root = document.documentElement;
    root.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }
  function toggleTheme() { dark = !dark; applyTheme(); }

  // ---------- Helpers ----------
  function withTimeout<T>(p: Promise<T>, ms = 90_000) {
    return Promise.race([
      p,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms)
      )
    ]);
  }

  // Guarded Code 39 string: wrap in asterisks
  function toCode39(value: string | number) {
    const s = String(value ?? '').trim();
    return `*${s}*`;
  }

  // Persist rows/meta to storage (both local & session for flexibility)
  function persistState() {
    try {
      const rowsJson = JSON.stringify(rows ?? []);
      const metaJson = JSON.stringify(meta);
      localStorage.setItem(STORAGE_ROWS_KEY, rowsJson);
      localStorage.setItem(STORAGE_META_KEY, metaJson);
      sessionStorage.setItem(STORAGE_ROWS_KEY, rowsJson);
      sessionStorage.setItem(STORAGE_META_KEY, metaJson);
    } catch { /* ignore quota issues */ }
  }
  function restoreState() {
    try {
      const rawRows = localStorage.getItem(STORAGE_ROWS_KEY) || sessionStorage.getItem(STORAGE_ROWS_KEY);
      const rawMeta = localStorage.getItem(STORAGE_META_KEY) || sessionStorage.getItem(STORAGE_META_KEY);
      const r = rawRows ? JSON.parse(rawRows) : [];
      const m = rawMeta ? JSON.parse(rawMeta) : null;
      if (Array.isArray(r) && r.length > 0) rows = r;
      if (m) meta = m;
    } catch { /* ignore */ }
  }
  function clearState() {
    try {
      localStorage.removeItem(STORAGE_ROWS_KEY);
      localStorage.removeItem(STORAGE_META_KEY);
      sessionStorage.removeItem(STORAGE_ROWS_KEY);
      sessionStorage.removeItem(STORAGE_META_KEY);
    } catch {}
  }

  // Open labels in a NEW TAB and keep current page intact
  function printLabels() {
    persistState();
    window.open('/labels', '_blank', 'noopener,noreferrer');
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

      // Save immediately so Back / refresh / labels new tab all work
      persistState();
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

  // ---------- Drag-anywhere ----------
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
      uploadAndExtract();
    }
  }

  function resetAll() {
    file = null; rows = []; meta = null; error = ''; lastParserURL = ''; lastStatus = 0;
    clearState();
  }

  // For label association a11y
  const fileInputId = 'pdf-file-input';
  const pagesInputId = 'pages-input';
</script>

<svelte:head>
  <!-- Libre Barcode 39 font for Code 39 barcodes -->
  <link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+39&display=swap" rel="stylesheet" />
  <style>
    .barcode39 {
      font-family: 'Libre Barcode 39', cursive;
      line-height: 1;
      letter-spacing: 0;
      /* Size tuned for table; labels page can render larger */
      font-size: 42px;
      white-space: nowrap;
    }
  </style>
</svelte:head>

<!-- Page shell -->
<div class="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-slate-100 transition-colors">

  <!-- Drag overlay -->
  {#if dragging}
    <div class="fixed inset-0 z-40 bg-black/40 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div class="mx-6 rounded-3xl border-2 border-dashed border-white/80 bg-white/90 dark:bg-slate-800/90 p-10 text-center shadow-2xl">
        <div class="text-2xl font-semibold mb-2">Drop your PDF anywhere</div>
        <div class="text-slate-600 dark:text-slate-300">We’ll list only items where <span class="font-semibold">SOH ≤ MPL</span>.</div>
      </div>
    </div>
  {/if}

  <!-- Header -->
  <header class="sticky top-0 z-30 border-b border-slate-200/60 bg-white/70 dark:bg-slate-950/60 backdrop-blur-md">
    <div class="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="text-lg font-semibold tracking-tight">Inventory Filter</div>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="inline-flex items-center gap-2 rounded-lg border border-slate-300/70 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 px-3 py-1.5 text-sm hover:bg-white dark:hover:bg-slate-900"
          on:click={toggleTheme}
          aria-label="Toggle dark mode">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            {#if dark}
              <path d="M21.64 13A9 9 0 0 1 12 3a9 9 0 1 0 9.64 10z"/>
            {:else}
              <path d="M12 4a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V5a1 1 0 0 1 1-1Zm0 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8-5h2a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2ZM2 11h2a1 1 0 1 1 0 2H2a1 1 0 1 1 0-2Zm14.95 6.536 1.414 1.414a1 1 0 1 1-1.414 1.414l-1.414-1.414a1 1 0 0 1 1.414-1.414ZM6.05 5.464 4.636 4.05A1 1 0 0 1 6.05 2.636L7.464 4.05A1 1 0 1 1 6.05 5.464Zm0 13.072L4.636 19.95a1 1 0 0 0 1.414 1.414l1.414-1.414A1 1 0 1 0 6.05 18.536Zm11.313-13.072a1 1 0 1 0-1.414-1.414L14.536 5.464A1 1 0 1 0 15.95 6.878l1.414-1.414Z"/>
            {/if}
          </svg>
          <span class="hidden sm:inline">{dark ? 'Dark' : 'Light'}</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Hero -->
  <section class="relative">
    <div class="mx-auto max-w-6xl px-4 py-10">
      <div class="grid gap-6 md:grid-cols-5">
        <!-- Left: Drop/choose card -->
        <div class="md:col-span-3">
          <div class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 shadow-sm">
            <h1 class="text-2xl font-bold tracking-tight">Upload your report</h1>
            <p class="mt-1 text-slate-600 dark:text-slate-400">Drop a PDF anywhere, or choose a file. We’ll extract rows where <span class="font-semibold">SOH ≤ MPL</span>.</p>

            <div class="mt-5 space-y-5">

              <!-- File input -->
              <div class="space-y-2">
                <label for={fileInputId} class="block text-sm font-medium text-slate-700 dark:text-slate-300">PDF file</label>
                <label class="group relative flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-6 hover:border-sky-400 hover:bg-sky-50 dark:hover:bg-slate-700/80 transition">
                  <div class="flex items-center gap-3">
                    <div class="rounded-xl bg-white dark:bg-slate-900 p-2 shadow-sm ring-1 ring-slate-200/60 dark:ring-slate-700">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 13h6m-6 4h6M3 7h6l2 2h10v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></svg>
                    </div>
                    <div>
                      <div class="text-slate-900 dark:text-slate-100 font-medium">{file ? 'Change PDF' : 'Click to choose a PDF'}</div>
                      <div class="text-slate-500 dark:text-slate-400 text-sm">…or drop it anywhere on this page</div>
                    </div>
                  </div>
                  <div class="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[50%] text-right">{file ? file.name : 'No file selected'}</div>
                  <input id={fileInputId} class="absolute inset-0 opacity-0 cursor-pointer" type="file" accept=".pdf" on:change={onFileInput} />
                </label>
              </div>

              <!-- Options -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="sm:col-span-1">
                  <label for={pagesInputId} class="block text-sm font-medium text-slate-700 dark:text-slate-300">Pages to scan</label>
                  <input id={pagesInputId} type="number" min="0" step="1" bind:value={limitPages}
                    class="mt-1 block w-full rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-sky-500 focus:ring-sky-500 px-3 py-2"
                    placeholder="0 = all" />
                </div>
              </div>

              <!-- Actions -->
              <div class="flex flex-wrap items-center gap-3 pt-2">
                <button
                  on:click={uploadAndExtract}
                  class="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-white shadow hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={loading || !file}>
                  {#if loading}
                    <svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                    </svg>
                    Processing…
                  {:else}
                    Upload & Extract
                  {/if}
                </button>

                <button on:click={resetAll}
                  class="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800">
                  Reset
                </button>

                {#if lastStatus}
                  <span class="text-xs text-slate-500">HTTP {lastStatus}</span>
                {/if}
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Status card -->
        <div class="md:col-span-2">
          <div class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 shadow-sm h-full">
            <h2 class="text-lg font-semibold">Status</h2>
            <div class="mt-4 space-y-3 text-sm">
              {#if meta}
                <div class="grid grid-cols-2 gap-3">
                  <div class="rounded-xl bg-slate-100 dark:bg-slate-800/70 p-3">
                    <div class="text-xs text-slate-500">Rows returned</div>
                    <div class="text-lg font-semibold">{meta.rows_returned}</div>
                  </div>
                  <div class="rounded-xl bg-slate-100 dark:bg-slate-800/70 p-3">
                    <div class="text-xs text-slate-500">Pages scanned</div>
                    <div class="text-lg font-semibold">{meta.pages_scanned}/{meta.pages_total}</div>
                  </div>
                </div>
              {:else}
                <div class="rounded-xl bg-slate-100 dark:bg-slate-800/70 p-4 text-slate-600 dark:text-slate-300">
                  No run yet. Choose a PDF and click <span class="font-semibold">Upload & Extract</span>, or drop a file anywhere.
                </div>
              {/if}
              {#if error}
                <div class="rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950 p-3 text-rose-800 dark:text-rose-200">
                  <div class="font-semibold">Error</div>
                  <pre class="mt-1 whitespace-pre-wrap text-xs">{error}</pre>
                </div>
              {/if}
            </div>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div class="mt-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 shadow-sm">
        <div class="flex flex-wrap items-center gap-3">
          <h2 class="text-lg font-semibold">Results</h2>
          {#if rows.length}
            <div class="ml-auto flex items-center gap-3">
              <button on:click={copyTSV} class="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800">Copy TSV</button>
              <button on:click={downloadCSV} class="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800">Download CSV</button>
              <button on:click={printLabels} class="rounded-xl bg-sky-600 dark:bg-sky-600 text-white px-3 py-2 text-sm hover:opacity-90">Print labels</button>
            </div>
          {/if}
        </div>

        {#if !loading && !error && rows.length === 0}
          <div class="mt-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 text-slate-700 dark:text-slate-300">
            No rows matched (SOH ≤ MPL). Try scanning more pages (set to <span class="font-semibold">0</span> to scan the whole PDF).
          </div>
        {/if}

        {#if rows.length}
          <div class="mt-4 overflow-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table class="min-w-[760px] w-full text-left">
              <thead class="bg-slate-100 dark:bg-slate-800 sticky top-0">
                <tr class="text-slate-700 dark:text-slate-200">
                  <th class="px-4 py-2 text-sm font-semibold">Article</th>
                  <th class="px-4 py-2 text-sm font-semibold">Description</th>
                  <th class="px-4 py-2 text-sm font-semibold">SOH</th>
                  <th class="px-4 py-2 text-sm font-semibold">MPL</th>
                </tr>
              </thead>
              <tbody class="[&>tr:nth-child(odd)]:bg-white [&>tr:nth-child(even)]:bg-slate-50 dark:[&>tr:nth-child(odd)]:bg-slate-900/60 dark:[&>tr:nth-child(even)]:bg-slate-900/30">
                {#each rows as r}
                  <tr class="border-t border-slate-200 dark:border-slate-800 align-top">
                    <td class="px-4 py-2 tabular-nums">
                      <div class="font-medium">{r.article}</div>
                      <div class="barcode39 text-black dark:text-white mt-1">{toCode39(r.article)}</div>
                    </td>
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

      <!-- Footer -->
      <div class="mt-10 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div>Only rows with <span class="font-semibold">SOH ≤ MPL</span> are returned.</div>
        {#if meta}
<!--
          <div>Parsed with modes: {meta.mode_used?.join(', ')}</div>

-->
        {/if}
      </div>
    </div>
  </section>
</div>
