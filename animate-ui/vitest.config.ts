import { defineConfig } from 'vitest/config';

// One suite for the whole distribution: components, CLI, registry
// integrity, and docs routes.
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
  },
});
