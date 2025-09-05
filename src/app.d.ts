// Types for Cloudflare Pages environment variables in SvelteKit
// Accessible via the 'platform' argument in +server endpoints
declare namespace App {
  interface Platform {
    env?: {
      OPENAI_API_KEY: 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;
      OPENAI_MODEL?: gpt-4o;
      OPENAI_BASE_URL?: string;
    };
    cf?: Record<string, unknown>;
    caches: CacheStorage;
  }
}
