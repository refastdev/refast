/// <reference types="vitest" />
/// <reference types="vite" />
import { refastPlugin } from '@refastdev/refast-dev';
import { defineConfig } from 'vite';

export default defineConfig({
  appType: 'spa',
  plugins: [
    refastPlugin({
      appType: 'react',
      generateRoutes: {
        open: true,
        options: {
          pageRoot: 'custom-path/src/pages',
          generatePath: 'custom-path/src/routes/index.ts',
        },
      },
    }),
  ],
});
