// src/routes/+layout.ts
export const ssr = false;       // render pages on the client, avoids worker SSR pitfalls
export const prerender = true;  // emit static HTML for routes at build time
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css';
</script>

<slot />
