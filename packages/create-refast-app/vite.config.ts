/// <reference types="vitest" />
/// <reference types="vite" />
import path from 'path'
import { defineConfig } from 'vite'
import { externalizeDeps } from 'vite-plugin-externalize-deps'

export default defineConfig({
  appType: 'custom',
  root: __dirname,
  base: '/',
  cacheDir: 'node_modules/.vite', // 缓存目录位置
  plugins: [
    // https://github.com/davidmyersdev/vite-plugin-externalize-deps
    externalizeDeps({
      deps: true,
      devDeps: true,
      nodeBuiltins: true,
      peerDeps: true,
      optionalDeps: true
    })
  ],
  build: {
    minify: false,
    outDir: 'dist',
    sourcemap: false,
    lib: {
      entry: path.join(__dirname, 'src/index.ts'),
      formats: ['cjs'],
      name: 'create-refast-app',
      fileName: 'index'
    }
  },
  test: {
    include: ['test/**/*.test.?(c|m)[jt]s?(x)'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    globals: true
  }
})
