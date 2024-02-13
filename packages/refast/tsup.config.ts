import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: [
      'src/index.ts',
      'module/encrypt/index.ts',
      'module/log/index.ts',
      'module/request/index.ts',
      'module/state/index.ts',
      'module/storage/index.ts',
    ],
    format: ['esm'],
    dts: {
      entry: {
        index: './src/index.ts',
        encrypt: './module/encrypt/index.ts',
        log: './module/log/index.ts',
        request: './module/request/index.ts',
        state: './module/state/index.ts',
        storage: './module/storage/index.ts',
      },
    },
    external: ['react', 'react-router-dom', '@refastdev/refast-router'],
    noExternal: ['@generouted/react-router'],
  },
]);
