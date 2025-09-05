import adapter from '@sveltejs/adapter-cloudflare';

export default {
  kit: {
    adapter: adapter(),
    prerender: {
      handleHttpError: ({ path, message }) => {
        if (message.includes('404') && path === '/favicon.png') return; // ignore this one
        throw new Error(message);
      }
    }
  }
};
