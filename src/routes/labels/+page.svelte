<script lang="ts">
  import { onMount } from 'svelte';

  type Row = { article: string; description: string; soh: number; mpl: number };

  // UI/state
  let rows: Row[] = [];
  let error = '';
  let columns: number = 3;
  let mode: 'svg' | 'font' = 'svg';
  let svgSupported = true;

  // Smart back behavior for new-tab vs in-app nav
  function smartBack() {
    // If opened by script and there's no meaningful history, try to close
    if ((window.opener || window.opener === null) && history.length <= 1) {
      try { window.close(); return; } catch {}
    }
    // If we came from same origin, go back
    try {
      const ref = document.referrer ? new URL(document.referrer) : null;
      if (ref && ref.origin === location.origin) {
        history.back();
        return;
      }
    } catch {}
    // Fallback: go home
    location.href = '/';
  }

  // Read rows saved by the main page
  onMount(() => {
    try {
      const raw = sessionStorage.getItem('mpl_rows_v1') || localStorage.getItem('mpl_rows_v1');
      rows = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(rows) || rows.length === 0) {
        error = 'No rows found. Go back and run an extract first.';
      }
    } catch {
      error = 'Could not read saved rows.';
    }

    svgSupported = !!document.createElementNS?.('http://www.w3.org/2000/svg', 'svg').createSVGRect;

    // initial paint
    queueMicrotask(renderAll);

    const rerender = () => renderAll();
    window.addEventListener('resize', rerender);
    window.addEventListener('beforeprint', rerender);
    return () => {
      window.removeEventListener('resize', rerender);
      window.removeEventListener('beforeprint', rerender);
    };
  });

  // Re-render when relevant inputs change
  $: if (mode === 'svg' && svgSupported) {
    // re-run whenever these change
    void columns; void rows.length;
    renderAll();
  }

  /* ---------------- Code 39 (SVG) ---------------- */

  // Allowed characters in Code39
  const ALLOWED = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%".split("");

  // n = narrow, w = wide (9 elements, 3 wide). Patterns start with a bar.
  const C39: Record<string, string> = {
    '0': 'nnnwwnwnn', '1': 'wnnwnnnnw', '2': 'nnwwnnnnw', '3': 'wnwwnnnnn',
    '4': 'nnnwwnnnw', '5': 'wnnwwnnnn', '6': 'nnwwwnnnn', '7': 'nnnwnnwnw',
    '8': 'wnnwnnwnn', '9': 'nnwwnnwnn', 'A': 'wnnnnwnnw', 'B': 'nnwnnwnnw',
    'C': 'wnwnnwnnn', 'D': 'nnnnwwnnw', 'E': 'wnnnwwnnn', 'F': 'nnwnwwnnn',
    'G': 'nnnnnwwnw', 'H': 'wnnnnwwnn', 'I': 'nnwnnwwnn', 'J': 'nnnnwwwnn',
    'K': 'wnnnnnnww', 'L': 'nnwnnnnww', 'M': 'wnwnnnnwn', 'N': 'nnnnwnnww',
    'O': 'wnnnwnnwn', 'P': 'nnwnwnnwn', 'Q': 'nnnnnnwww', 'R': 'wnnnnnwwn',
    'S': 'nnwnnnwwn', 'T': 'nnnnwnwwn', 'U': 'wwnnnnnnw', 'V': 'nwwnnnnnw',
    'W': 'wwwnnnnnn', 'X': 'nwnnwnnnw', 'Y': 'wwnnwnnnn', 'Z': 'nwwnwnnnn',
    '-': 'nwnnnnwnw', '.': 'wwnnnnwnn', ' ': 'nwwnnnwnn', '$': 'nwnwnwnnn',
    '/': 'nwnwnnnwn', '+': 'nwnnnwnwn', '%': 'nnnwnwnwn', '*': 'nwnnwnwnn'
  };

  function sanitizeData(val: string | number) {
    const s = String(val ?? '').toUpperCase().trim();
    return [...s].filter((ch) => ALLOWED.includes(ch)).join('');
  }
  const withGuards = (s: string) => `*${s}*`;

  // Build bar/space runs; includes quiet zones (10 narrow units each side)
  function buildRuns(data: string): { isBar: boolean; units: number }[] {
    const runs: { isBar: boolean; units: number }[] = [];
    const push = (isBar: boolean, units: number) => {
      if (units <= 0) return;
      const last = runs[runs.length - 1];
      if (last && last.isBar === isBar) last.units += units;
      else runs.push({ isBar, units });
    };

    // quiet left
    push(false, 10);

    const chars = [...data];
    chars.forEach((ch, idx) => {
      const pat = C39[ch];
      if (!pat) return;
      let isBar = true;
      for (const token of pat) {
        push(isBar, token === 'w' ? 3 : 1);
        isBar = !isBar;
      }
      if (idx < chars.length - 1) push(false, 1); // inter-char gap
    });

    // quiet right
    push(false, 10);
    return runs;
  }

  // Render *all* barcodes into their hosts
  function renderAll() {
    if (mode !== 'svg' || !svgSupported) return;
    const hosts = document.querySelectorAll<HTMLElement>('.barcode-host');
    const cards = document.querySelectorAll<HTMLElement>('.label-card');

    rows.forEach((r, i) => {
      renderIntoHost(r.article, hosts[i] || null, cards[i] || null);
    });
  }

  // Render one into a host <div>
  function renderIntoHost(article: string, host: HTMLElement | null, card: HTMLElement | null) {
    if (!host) return;

    // container sizing
    const container = card ?? host;
    const pad = 8;
    const width = Math.max(120, (container.clientWidth || 240) - pad * 2);
    const height = Math.max(44, Math.round(width * 0.18)); // ~4:1

    const dataText = sanitizeData(article);
    const data = withGuards(dataText);
    const runs = buildRuns(data);

    const totalUnits = runs.reduce((a, r) => a + r.units, 0);
    const modulePx = Math.max(0.7, Math.floor(width / totalUnits));
    const barcodeW = Math.max(1, Math.round(modulePx * totalUnits));

    // clear host
    host.innerHTML = '';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', String(barcodeW));
    svg.setAttribute('height', String(height));
    svg.setAttribute('viewBox', `0 0 ${barcodeW} ${height}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.classList.add('text-black', 'dark:text-white');

    let x = 0;
    for (const r of runs) {
      const wpx = r.units * modulePx;
      if (r.isBar) {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', String(x));
        rect.setAttribute('y', '0');
        rect.setAttribute('width', String(wpx));
        rect.setAttribute('height', String(height));
        rect.setAttribute('fill', 'currentColor');
        svg.appendChild(rect);
      }
      x += wpx;
    }
    host.appendChild(svg);
  }

  // helpers
  const human = (v: string | number) => String(v ?? '').trim();
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+39&display=swap" rel="stylesheet" />
  <style>
    /* Toolbar select arrow (cross-browser) */
    .toolbar {
      --arrow: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23334155' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
    }
    .toolbar select {
      -webkit-appearance: none;
      appearance: none;
      background-image: var(--arrow);
      background-repeat: no-repeat;
      background-position: right 10px center;
      background-size: 12px;
      padding-right: 32px;
      min-height: 36px;
      line-height: 1.2;
      border-radius: 10px;
    }
    .toolbar label { display:inline-flex; align-items:center; min-height:36px; font-size:14px; }

    /* Font fallback look */
    .barcode39 {
      font-family: 'Libre Barcode 39', cursive;
      line-height: 1;
      letter-spacing: 0;
      white-space: nowrap;
      font-size: 46px;
    }

    /* Print tweaks */
    @media print {
      header, .controls { display: none !important; }
      .page { padding: 0; }
      .grid { gap: 8px; }
      .label-card { box-shadow: none; border-color: #000; }
    }
  </style>
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-slate-100 transition-colors">
  <!-- Header / controls -->
  <header class="sticky top-0 z-30 border-b border-slate-200/60 bg-white/70 dark:bg-slate-950/60 backdrop-blur-md">
    <div class="toolbar mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
      <button type="button" on:click={smartBack}
        class="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 inline-flex items-center gap-2">
        ← Back
      </button>

      <div class="controls flex items-center gap-4">
        <label class="text-sm text-slate-700 dark:text-slate-300">Renderer:</label>
        <select bind:value={mode}
          class="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm">
          <option value="svg">SVG (recommended)</option>
          <option value="font">Font fallback</option>
        </select>

        <label class="text-sm text-slate-700 dark:text-slate-300">Columns:</label>
        <select bind:value={columns}
          on:change={(e) => (columns = +(e.currentTarget as HTMLSelectElement).value)}
          class="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
    </div>
  </header>

  <section class="page mx-auto max-w-6xl px-4 py-6">
    {#if error}
      <div class="rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950 p-3 text-rose-800 dark:text-rose-200">
        {error}
      </div>
    {:else}
      <div
        class="grid"
        style={`display:grid; grid-template-columns: repeat(${columns}, minmax(0, 1fr)); gap: 12px;`}
      >
        {#each rows as r, i}
          <div class="label-card rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-sm flex flex-col justify-between">
            <!-- Description -->
            <div class="text-[13px] leading-tight font-medium truncate">{r.description}</div>

            <!-- Barcode -->
            {#if mode === 'svg' && svgSupported}
              <div class="mt-1 flex justify-center">
                <div class="barcode-host text-black dark:text-white" data-i={i} />
              </div>
            {:else}
              <div class="mt-1 text-center">
                <div class="barcode39 text-black dark:text-white">
                  {'*' + human(r.article) + '*'}
                </div>
              </div>
            {/if}

            <!-- Human-readable + SOH/MPL -->
            <div class="mt-2 text-center">
              <div class="text-sm font-semibold tracking-wide">{human(r.article)}</div>
              <div class="text-[12px] text-slate-600 dark:text-slate-300 mt-0.5">
                SOH: <span class="tabular-nums">{r.soh}</span>
                &nbsp;|&nbsp;
                MPL: <span class="tabular-nums">{r.mpl}</span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>
