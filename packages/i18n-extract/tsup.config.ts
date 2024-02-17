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
    skipNodeModulesBundle: true,
    external: ['react', 'react-router-dom', 'fs', 'path'],
    noExternal: [],
  },
]);
