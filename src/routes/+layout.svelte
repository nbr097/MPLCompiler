export const ssr = false;       // render pages on the client
export const prerender = true;  // emit static HTML at build time
<script lang="ts">
  import '../app.css'; // Tailwind entry
</script>

<slot />
