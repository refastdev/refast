import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: [
      'src/index.ts',
      'module/encrypt/index.ts',
      'module/locale/index.ts',
      'module/log/index.ts',
      'module/request/index.ts',
      'module/routes/index.ts',
      'module/state/index.ts',
      'module/storage/index.ts',
    ],
    format: ['esm'],
    dts: {
      entry: {
        index: './src/index.ts',
        encrypt: './module/encrypt/index.ts',
        locale: './module/locale/index.ts',
        log: './module/log/index.ts',
        request: './module/request/index.ts',
        routes: './module/routes/index.ts',
        state: './module/state/index.ts',
        storage: './module/storage/index.ts',
      },
    },
    minify: 'terser',
    external: ['react', 'react-router-dom'],
    noExternal: ['@generouted/react-router', '@refastdev/i18n', 'use-force-update'],
  },
]);
