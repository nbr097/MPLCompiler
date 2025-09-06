<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { tick } from 'svelte';

  type Row = {
    article: string | number;
    description?: string;
    soh?: number;
    mpl?: number;
    [k: string]: any;
  };

  let rows: Row[] = [];
  let loaded = false;

  // Adjustable columns (persisted)
  let cols = 3;
  const COLS_MIN = 1;
  const COLS_MAX = 6;

  // Keep refs to the grid and each barcode element for fitting
  let gridEl: HTMLElement | null = null;
  let barcodeEls: HTMLElement[] = [];

  function toCode39(v: string | number) {
    const s = String(v ?? '').trim();
    return `*${s}*`;
  }

  function handlePrint() { window.print(); }

  // Smart Back: if there's history, go back; otherwise go home
  function handleBack() {
    if (history.length > 1) history.back();
    else goto('/');
  }

  function persistCols() {
    try { localStorage.setItem('label_cols', String(cols)); } catch {}
  }

  function onColsInput(e: Event) {
    const v = Number((e.target as HTMLInputElement).value || cols);
    cols = Math.max(COLS_MIN, Math.min(COLS_MAX, v));
    persistCols();
    refitSoon();
  }
  function nudgeCols(delta: number) {
    cols = Math.max(COLS_MIN, Math.min(COLS_MAX, cols + delta));
    persistCols();
    refitSoon();
  }

  // Register barcode nodes for fitting
  function registerBarcode(node: HTMLElement) {
    barcodeEls.push(node);
    refitSoon();
    return { destroy() { barcodeEls = barcodeEls.filter((n) => n !== node); } };
  }

  // Fit routine
  const BASE_SIZE = 56;
  const MAX_SIZE = 80;
  const MIN_SIZE = 18;
  const SIDE_PADDING_PX = 2;

  function fitOne(el: HTMLElement) {
    const box = el.parentElement as HTMLElement | null;
    if (!box) return;
    const available = box.clientWidth - SIDE_PADDING_PX;
    if (available <= 0) return;

    el.style.fontSize = BASE_SIZE + 'px';
    const measured = el.scrollWidth || el.getBoundingClientRect().width || 0;
    if (measured <= 0) return;

    let newSize = (BASE_SIZE * available) / measured;
    if (newSize > MAX_SIZE) newSize = MAX_SIZE;
    if (newSize < MIN_SIZE) newSize = MIN_SIZE;
    el.style.fontSize = newSize + 'px';
  }

  let refitTimer: ReturnType<typeof setTimeout> | null = null;
  function refitSoon() {
    if (refitTimer) clearTimeout(refitTimer);
    refitTimer = setTimeout(() => { for (const el of barcodeEls) fitOne(el); }, 0);
  }

  let ro: ResizeObserver | null = null;
  function setupObservers() {
    if (gridEl && 'ResizeObserver' in window) {
      ro = new ResizeObserver(() => refitSoon());
      ro.observe(gridEl);
    }
    window.addEventListener('resize', refitSoon);
    window.addEventListener('orientationchange', refitSoon);
    window.addEventListener('beforeprint', () => { for (const el of barcodeEls) fitOne(el); });
  }
  function teardownObservers() {
    ro?.disconnect(); ro = null;
    window.removeEventListener('resize', refitSoon);
    window.removeEventListener('orientationchange', refitSoon);
  }

  onMount(async () => {
    // Prefer sessionStorage (same-tab), fallback to localStorage (new-tab)
    try {
      const rawSession = sessionStorage.getItem('mpl_rows_v1');
      const rawLocal = localStorage.getItem('mpl_rows_v1');
      rows = rawSession ? (JSON.parse(rawSession) as Row[]) : (rawLocal ? (JSON.parse(rawLocal) as Row[]) : []);
    } catch { rows = []; }

    try {
      const savedCols = Number(localStorage.getItem('label_cols') || cols);
      if (!Number.isNaN(savedCols)) cols = Math.max(COLS_MIN, Math.min(COLS_MAX, savedCols));
    } catch {}

    loaded = true;
    setupObservers();
    await tick();
    refitSoon();
  });
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+39&display=swap" rel="stylesheet" />
  <style>
    :root {
      --label-gap: 6mm;
      --label-pad: 4mm;
    }
    .barcode39 {
      font-family: 'Libre Barcode 39', cursive;
      line-height: 1;
      letter-spacing: 0;
      white-space: nowrap;
      color: currentColor;
      /* font-size set dynamically */
    }
    .barcode-box { width: 100%; overflow: visible; }

    @media print {
      @page { size: A4; margin: 10mm; }
      body { background: white !important; color: black !important; }
      .no-print { display: none !important; }
      .label { break-inside: avoid; }
      .barcode39 { color: black !important; }
    }
  </style>
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-slate-100 transition-colors">
  <!-- Top bar -->
  <div class="no-print sticky top-0 z-20 border-b border-slate-200/60 bg-white/75 dark:bg-slate-950/70 backdrop-blur-md">
    <div class="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button on:click={handleBack} class="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800">← Back</button>
        <div class="text-lg font-semibold tracking-tight">Labels</div>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2">
          <span class="text-sm">Columns</span>
          <button class="rounded-md border px-2 py-1 text-sm hover:bg-slate-50 dark:hover:bg-slate-800" on:click={() => nudgeCols(-1)} aria-label="Decrease columns">−</button>
          <input type="range" min={COLS_MIN} max={COLS_MAX} step="1" value={cols} on:input={onColsInput} class="w-32" aria-label="Columns slider" />
          <button class="rounded-md border px-2 py-1 text-sm hover:bg-slate-50 dark:hover:bg-slate-800" on:click={() => nudgeCols(+1)} aria-label="Increase columns">＋</button>
          <span class="w-6 text-center text-sm tabular-nums">{cols}</span>
        </div>
        <button on:click={handlePrint} class="rounded-lg bg-sky-600 text-white px-4 py-2 text-sm hover:opacity-90 disabled:opacity-50" disabled={!rows.length} aria-label="Print labels">Print</button>
      </div>
    </div>
  </div>

  <section class="mx-auto max-w-6xl px-4 py-6">
    {#if loaded && rows.length === 0}
      <div class="no-print mt-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 text-slate-700 dark:text-slate-300">
        No rows found. Go back and click <span class="font-semibold">Print labels</span> after extracting.
      </div>
    {:else}
      <div bind:this={gridEl} class="grid" style={`grid-template-columns: repeat(${cols}, 1fr); gap: var(--label-gap);`}>
        {#each rows as r (r.article)}
          <div class="label border rounded-xl p-[var(--label-pad)] bg-white dark:bg-slate-900 shadow-sm">
            <div class="barcode-box">
              <div class="barcode39 text-black dark:text-white" use:registerBarcode>{toCode39(r.article)}</div>
            </div>
            <div class="mt-1 text-xs opacity-70 tabular-nums">{r.article}</div>
            {#if r.description}
              <div class="mt-2 text-sm font-medium leading-snug">{r.description}</div>
            {/if}
            <div class="mt-2 text-xs grid grid-cols-2 gap-2 opacity-70">
              {#if r.soh !== undefined}<div>SOH: <span class="font-semibold">{r.soh}</span></div>{/if}
              {#if r.mpl !== undefined}<div>MPL: <span class="font-semibold">{r.mpl}</span></div>{/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>
