import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Bind to 0.0.0.0 so the sandbox preview can reach the dev server.
    host: true,
    port: 5175,
    allowedHosts: true,
  },
  preview: {
    host: true,
    port: 5175,
    allowedHosts: true,
  },
});
