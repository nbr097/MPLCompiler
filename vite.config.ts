// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  ssr: {
    // Keep the native addon external so Node can load it.
    external: ['better-sqlite3']
  }
});
