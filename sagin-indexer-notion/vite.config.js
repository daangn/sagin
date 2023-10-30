/// <reference types="vitest" />

import * as path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const serverPath = path.resolve(__dirname, 'src/main.ts');

export default defineConfig(({ mode }) => {
  process.env = {
    ...process.env,
    ...loadEnv(mode, process.cwd(), ''),
  };

  return {
    build: {
      target: 'node20',
      ssr: serverPath,
      rollupOptions: {
        input: serverPath,
      },
    },
    optimizeDeps: {
      include: ['@sagin/indexer'],
      disabled: true,
    },
    plugins: [tsconfigPaths()],
  };
});
