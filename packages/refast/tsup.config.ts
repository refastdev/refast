import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: [
      'src/index.ts',
      'module/encrypt/index.ts',
      'module/log/index.ts',
      'module/state/index.ts',
    ],
    format: ['esm'],
    dts: {
      entry: {
        index: './src/index.ts',
        encrypt: './module/encrypt/index.ts',
        log: './module/log/index.ts',
        state: './module/state/index.ts',
      },
    },
    external: ['react', 'react-router-dom'],
    noExternal: ['@generouted/react-router'],
  },
]);
