import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/index.ts', './state/index.ts'],
    format: ['esm'],
    dts: {
      entry: {
        index: './src/index.ts',
        state: './src/state/index.ts'
      }
    },
    external: ['react', 'react-router-dom'],
    noExternal: ['@generouted/react-router']
  }
])
