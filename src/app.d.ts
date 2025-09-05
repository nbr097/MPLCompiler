// Types for Cloudflare Pages environment variables in SvelteKit
// Accessible via the 'platform' argument in +server endpoints
declare namespace App {
  interface Platform {
    env?: {
      OPENAI_API_KEY: string;
      OPENAI_MODEL?: string;
      OPENAI_BASE_URL?: string;
    };
    cf?: Record<string, unknown>;
    caches: CacheStorage;
  }
}
