import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: 'public',
  build: {
    outDir: 'build', // Specify your custom build directory
  },
  root: './', // Root directory containing package.json
});
