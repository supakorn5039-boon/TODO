import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// Vite configuration
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});
