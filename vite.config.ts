import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import glsl from "vite-plugin-glsl";
import path from "path";
import glslify from "vite-plugin-glslify";
import { compression } from 'vite-plugin-compression2'
import { visualizer } from 'rollup-plugin-visualizer';

// Plugin personnalisé pour injecter les en-têtes CSP
const cspPlugin = () => {
  return {
    name: 'csp-headers',
    transformIndexHtml(html: string) {
      const cspMeta = '<meta http-equiv="Content-Security-Policy" content="default-src \'self\'; script-src \'self\' \'unsafe-inline\' \'unsafe-eval\'; style-src \'self\' \'unsafe-inline\'; font-src \'self\' data:; img-src \'self\' data: blob:; connect-src \'self\'; frame-ancestors \'none\'; base-uri \'self\'; form-action \'self\'; upgrade-insecure-requests">';
      
      // Insérer la meta CSP dans le head
      return html.replace(
        /<head>/,
        `<head>${cspMeta}`
      );
    }
  };
};

export default defineConfig({
  server: {
    port: 3000,
    host: true,
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: blob:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Cross-Origin-Resource-Policy': 'same-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()'
    }
  },
  plugins: [
    react(),
    glslify(),
    compression(),
    cspPlugin(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          gsap: ['gsap'],
          three: ['three']
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      }
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        drop_console: true,
        drop_debugger: true,
        passes: 2
      },
      mangle: {
        toplevel: true
      }
    },
    cssCodeSplit: true,
    sourcemap: false,
    target: 'es2015'
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'gsap']
  }
});
