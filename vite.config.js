import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  plugins: [{
    name: 'making-page-directories',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (/^\/making\/[a-z0-9-]+\/(?:\?.*)?$/.test(request.url || '')) request.url = request.url.replace(/\/(?=\?|$)/, '/index.html');
        next();
      });
    },
  }],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
  },
})
