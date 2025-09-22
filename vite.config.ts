import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
      // JSX runtime optimization
      jsxRuntime: 'automatic',
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/constants": path.resolve(__dirname, "./src/constants"),
      "@/contexts": path.resolve(__dirname, "./src/contexts"),
    },
  },
  build: {
    // Optimize build for production
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,

    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React and related libraries
          vendor: ['react', 'react-dom'],

          // UI utilities chunk
          utils: ['lucide-react'],

          // Performance monitoring chunk
          performance: ['./src/utils/performance.ts'],

          // Terminal system chunk
          terminal: [
            './src/utils/terminalCommands.ts',
            './src/utils/terminalStyles.ts',
            './src/hooks/useTerminal.ts'
          ]
        },

        // Clean output filenames
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },

    // Source map for debugging in production
    sourcemap: false,

    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
  },

  // Development server optimizations
  server: {
    hmr: {
      overlay: true
    }
  },

  // CSS optimization
  css: {
    devSourcemap: true
  },

  // Optimization for dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
    exclude: []
  }
});
