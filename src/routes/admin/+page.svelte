<script lang="ts">
  export let data: {
    summary: {
      totals: { uploads: number; rows_returned: number };
      byStore: Array<{
        store_number: string;
        store_name: string;
        uploads: number;
        rows_returned: number;
        first_upload: string;
        last_upload: string;
      }>;
      recent: Array<any>;
    };
  };

  const { totals, byStore, recent } = data.summary;

  function fmt(ts: string) {
    // stored in UTC ISO; show local time
    try { return new Date(ts).toLocaleString(); } catch { return ts; }
  }
</script>

<div class="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-slate-100">
  <header class="sticky top-0 z-30 border-b border-slate-200/60 bg-white/70 dark:bg-slate-950/60 backdrop-blur-md">
    <div class="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
      <div class="text-lg font-semibold tracking-tight">Admin — Upload Logs</div>
      <a href="/" class="rounded-lg border px-3 py-1.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800">← Back</a>
    </div>
  </header>

  <section class="mx-auto max-w-6xl px-4 py-6 space-y-8">
    <!-- Stats -->
    <div class="grid sm:grid-cols-2 gap-4">
      <div class="rounded-2xl border p-4 bg-white/70 dark:bg-slate-900/70">
        <div class="text-xs text-slate-500">Total uploads</div>
        <div class="text-2xl font-semibold">{totals.uploads}</div>
      </div>
      <div class="rounded-2xl border p-4 bg-white/70 dark:bg-slate-900/70">
        <div class="text-xs text-slate-500">Total rows returned</div>
        <div class="text-2xl font-semibold">{totals.rows_returned}</div>
      </div>
    </div>

    <!-- By store -->
    <div class="rounded-2xl border p-4 bg-white/70 dark:bg-slate-900/70">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold">By Store</h2>
        <div class="text-xs text-slate-500">Sorted by store number/name</div>
      </div>
      <div class="overflow-auto">
        <table class="min-w-[760px] w-full text-left">
          <thead class="bg-slate-100 dark:bg-slate-800 sticky top-0">
            <tr class="text-slate-700 dark:text-slate-200">
              <th class="px-4 py-2 text-sm font-semibold">Store #</th>
              <th class="px-4 py-2 text-sm font-semibold">Store Name</th>
              <th class="px-4 py-2 text-sm font-semibold">Uploads</th>
              <th class="px-4 py-2 text-sm font-semibold">Rows Returned</th>
              <th class="px-4 py-2 text-sm font-semibold">First Upload</th>
              <th class="px-4 py-2 text-sm font-semibold">Last Upload</th>
            </tr>
          </thead>
          <tbody class="[&>tr:nth-child(odd)]:bg-white [&>tr:nth-child(even)]:bg-slate-50 dark:[&>tr:nth-child(odd)]:bg-slate-900/60 dark:[&>tr:nth-child(even)]:bg-slate-900/30">
            {#each byStore as s}
              <tr class="border-t border-slate-200 dark:border-slate-800">
                <td class="px-4 py-2">{s.store_number || '—'}</td>
                <td class="px-4 py-2">{s.store_name || '—'}</td>
                <td class="px-4 py-2 tabular-nums">{s.uploads}</td>
                <td class="px-4 py-2 tabular-nums">{s.rows_returned}</td>
                <td class="px-4 py-2 text-xs">{fmt(s.first_upload)}</td>
                <td class="px-4 py-2 text-xs">{fmt(s.last_upload)}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Recent uploads -->
    <div class="rounded-2xl border p-4 bg-white/70 dark:bg-slate-900/70">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold">Recent Uploads</h2>
        <div class="text-xs text-slate-500">Last 200</div>
      </div>
      <div class="overflow-auto">
        <table class="min-w-[860px] w-full text-left">
          <thead class="bg-slate-100 dark:bg-slate-800 sticky top-0">
            <tr class="text-slate-700 dark:text-slate-200">
              <th class="px-4 py-2 text-sm font-semibold">When</th>
              <th class="px-4 py-2 text-sm font-semibold">File</th>
              <th class="px-4 py-2 text-sm font-semibold">Store #</th>
              <th class="px-4 py-2 text-sm font-semibold">Store Name</th>
              <th class="px-4 py-2 text-sm font-semibold">Pages</th>
              <th class="px-4 py-2 text-sm font-semibold">Rows Returned</th>
              <th class="px-4 py-2 text-sm font-semibold">Rows Considered</th>
              <th class="px-4 py-2 text-sm font-semibold">Limit</th>
              <th class="px-4 py-2 text-sm font-semibold">Parser</th>
              <th class="px-4 py-2 text-sm font-semibold">IP</th>
            </tr>
          </thead>
          <tbody class="[&>tr:nth-child(odd)]:bg-white [&>tr:nth-child(even)]:bg-slate-50 dark:[&>tr:nth-child(odd)]:bg-slate-900/60 dark:[&>tr:nth-child(even)]:bg-slate-900/30">
            {#each recent as r}
              <tr class="border-t border-slate-200 dark:border-slate-800">
                <td class="px-4 py-2 text-xs">{fmt(r.created_at)}</td>
                <td class="px-4 py-2">{r.filename || '—'}</td>
                <td class="px-4 py-2 tabular-nums">{r.store_number || '—'}</td>
                <td class="px-4 py-2">{r.store_name || '—'}</td>
                <td class="px-4 py-2 tabular-nums">{r.pages_scanned}/{r.pages_total}</td>
                <td class="px-4 py-2 tabular-nums">{r.rows_returned ?? '—'}</td>
                <td class="px-4 py-2 tabular-nums">{r.rows_considered ?? '—'}</td>
                <td class="px-4 py-2 tabular-nums">{r.limit_pages ?? '—'}</td>
                <td class="px-4 py-2 text-xs">{r.parser_url || '—'}</td>
                <td class="px-4 py-2 text-xs">{r.client_ip || '—'}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </section>
</div>
