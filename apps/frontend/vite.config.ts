import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared-types': path.resolve(__dirname, '../../packages/shared-types/src'),
      '@shared-ui': path.resolve(__dirname, '../../packages/shared-ui/src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router') || id.includes('react-dom') || id.includes('react/')) {
              return 'vendor';
            }
            if (id.includes('@radix-ui')) {
              return 'ui';
            }
            if (id.includes('recharts')) {
              return 'charts';
            }
          }
        },
      },
    },
  },
});
