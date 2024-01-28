/// <reference types="vitest" />
/// <reference types="vite" />
import pkg from './package.json'
import path from 'path'
import { defineConfig } from 'vite'

import { getLib } from '@refastdev/config-vite'

const libConfig = getLib({
  entry: path.resolve(__dirname, 'src/index.ts'),
  libName: pkg.name
})

// https://cn.vitejs.dev/config/
export default defineConfig({
  ...libConfig,
  root: __dirname // 根目录
})
