import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // optional: fails if 5173 is busy
    proxy: {
      '/api': 'http://localhost:8080', // forward all /api requests to backend
    },
  },
});
