import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// Note: we must not import the server at top-level because it pulls in
// server-only dependencies (Sentry, profiling) which can break Vite's
// config bundling. We'll lazy-import it inside the dev-only plugin.
import { visualizer } from 'rollup-plugin-visualizer';
import { compression } from 'vite-plugin-compression2';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist/spa",
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-icons', '@radix-ui/react-slot'],
          'form-vendor': ['react-hook-form', 'zod'],
          'query-vendor': ['@tanstack/react-query'],
          'date-vendor': ['date-fns'],
          'chart-vendor': ['recharts'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  plugins: [
    react(),
    expressPlugin(),
    compression(), // Compress assets
    visualizer({ // Analyze bundle size
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
            },
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      // Lazy import the server factory so that Vite doesn't evaluate
      // server-only code (Sentry, profiling) while bundling the config.
      (async () => {
        const mod = await import('./server');
        const app = mod.createServer();
        server.middlewares.use(app);
      })().catch((err) => {
        // If server import fails, log it but don't crash Vite.
        // The dev server can still run without the express middleware.
        // eslint-disable-next-line no-console
        console.error('Failed to mount express middleware:', err);
      });
    },
  };
}
