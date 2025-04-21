
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: true,
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: [
            '@radix-ui/react-avatar',
            '@radix-ui/react-label',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
          ],
          components: [
            // Fix: Changed from directory to individual components to avoid EISDIR error
            '@/components/ui/button',
            '@/components/ui/sidebar',
            '@/components/ui/animated-group',
            '@/components/ui/dialog',
            '@/components/ui/drawer',
            '@/components/ui/form',
          ],
          tanstack: ['@tanstack/react-query'],
          animations: ['framer-motion']
        },
      }
    },
  },
}));
