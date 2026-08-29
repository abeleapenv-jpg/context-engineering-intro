import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Reachable from outside the sandbox; preview hostnames are dynamic.
    host: true,
    port: 5174,
    allowedHosts: true,
  },
  preview: {
    host: true,
    port: 4174,
    allowedHosts: true,
  },
});
