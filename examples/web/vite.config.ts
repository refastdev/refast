/// <reference types="vitest" />
/// <reference types="vite" />
import { refastPlugin } from '@refastdev/refast-dev'
import path from 'path'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vite'

import pkg from './package.json'

const appName = pkg.name

export default defineConfig({
  appType: 'spa', // 单页面应用
  envPrefix: `${appName.toUpperCase()}_`, // 以该前缀开头的环境变量会暴露在源码:  import.meta.env
  envDir: 'scripts/env', // 指定加载env文件的目录
  json: {
    stringify: true // 导入的 JSON 会被转换为 export default JSON.parse("..."), 这样会比转译成对象字面量性能更好
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
    }
  },
  plugins: [
    refastPlugin({
      appType: 'react'
    })
  ],
  test: {
    // 测试: https://cn.vitest.dev/config/
    include: ['test/**/*.test.?(c|m)[jt]s?(x)'],
    exclude: ['**/node_modules/**', '**/build/**'],
    environment: 'happy-dom',
    globals: true
  },
  css: {
    postcss: {
      // tailwindcss支持
      plugins: [tailwindcss]
    }
  }
})
