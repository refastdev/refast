import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts', 'src/components/index.ts', 'src/hooks/index.ts'],
    format: ['esm'],
    dts: {
      entry: {
        index: './src/index.ts',
        components: './src/components/index.ts',
        hooks: './src/hooks/index.ts',
      },
    },
    external: ['react', 'react-router-dom'],
    noExternal: ['@generouted/react-router'],
  },
]);
