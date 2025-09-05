// svelte.config.js
import adapter from '@sveltejs/adapter-cloudflare';

const config = {
  kit: {
    adapter: adapter()
  }
  // no preprocess needed for Tailwind/PostCSS
};

export default config;
