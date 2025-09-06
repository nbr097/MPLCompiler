<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  type Row = {
    article: string | number;
    description?: string;
    soh?: number;
    mpl?: number;
    [k: string]: any;
  };

  let rows: Row[] = [];
  let loaded = false;

  function toCode39(v: string | number) {
    const s = String(v ?? '').trim();
    return `*${s}*`;
  }

  function handlePrint() {
    window.print();
  }

  function handleBack() {
    goto('/');
  }

  onMount(() => {
    try {
      const raw = sessionStorage.getItem('mpl_rows_v1');
      rows = raw ? (JSON.parse(raw) as Row[]) : [];
    } catch {
      rows = [];
    } finally {
      loaded = true;
    }
  });
</script>

<svelte:head>
  <!-- Libre Barcode 39 for Code 39 barcodes -->
  <link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+39&display=swap" rel="stylesheet" />
  <style>
    :root {
      /* Tune these for your label stock */
      --label-min: 60mm;   /* min width per label card (allows ~3 across on A4) */
      --label-gap: 6mm;    /* gap between labels */
      --label-pad: 4mm;    /* internal padding per label */
    }

    .barcode39 {
      font-family: 'Libre Barcode 39', cursive;
      line-height: 1;
      letter-spacing: 0;
      font-size: 48px;  /* on-screen size; print can scale as needed */
      white-space: nowrap;
      color: currentColor;
    }

    /* Print rules: enforce white paper + black ink for barcodes/text */
    @media print {
      @page { size: A4; margin: 10mm; } /* adjust margins for your sheet */
      body { background: white !important; color: black !important; }
      .no-print { display: none !important; }
      .label { break-inside: avoid; }
      .barcode39 { color: black !important; }
    }
  </style>
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-slate-100 transition-colors">
  <!-- Top bar (hidden when printing) -->
  <div class="no-print sticky top-0 z-20 border-b border-slate-200/60 bg-white/75 dark:bg-slate-950/70 backdrop-blur-md">
    <div class="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button on:click={handleBack} class="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800">← Back</button>
        <div class="text-lg font-semibold tracking-tight">Labels</div>
      </div>
      <div class="flex items-center gap-2">
        <button
          on:click={handlePrint}
          class="rounded-lg bg-black text-white px-4 py-2 text-sm hover:opacity-90 disabled:opacity-50"
          disabled={!rows.length}
          aria-label="Print labels">
          Print
        </button>
      </div>
    </div>
  </div>

  <section class="mx-auto max-w-6xl px-4 py-6">
    {#if loaded && rows.length === 0}
      <div class="no-print mt-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 text-slate-700 dark:text-slate-300">
        No rows found. Go back and click <span class="font-semibold">Print labels</span> after extracting.
      </div>
    {:else}
      <!-- Responsive label grid; edit CSS variables at top to match your stationery -->
      <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(var(--label-min), 1fr)); gap: var(--label-gap);">
        {#each rows as r (r.article)}
          <div class="label border rounded-xl p-[var(--label-pad)] bg-white dark:bg-slate-900 shadow-sm">
            <!-- Barcode -->
            <div class="barcode39 text-black dark:text-white">{toCode39(r.article)}</div>

            <!-- Human-readable article -->
            <div class="mt-1 text-xs opacity-70 tabular-nums">{r.article}</div>

            <!-- Description -->
            {#if r.description}
              <div class="mt-2 text-sm font-medium leading-snug">{r.description}</div>
            {/if}

            <!-- Extra fields (optional) -->
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
