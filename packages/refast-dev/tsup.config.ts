import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: {
      entry: {
        index: './src/index.ts',
      },
    },
    external: ['react', 'react-router-dom'],
    noExternal: [],
  },
]);
