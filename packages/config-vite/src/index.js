import dts from 'vite-plugin-dts'
import { externalizeDeps } from 'vite-plugin-externalize-deps'

/**
 * @type {import('vite').UserConfig}
 */
const base = {
  base: '/',
  cacheDir: 'node_modules/.vite', // 缓存目录位置
  clearScreen: true, // 设为 false 可以避免 Vite 清屏而错过在终端中打印某些关键信息
  envDir: 'scripts/env', // 指定加载env文件的目录
  experimental: {
    // 启用实验性支持
    hmrPartialAccept: true
  },
  json: {
    stringify: true // 导入的 JSON 会被转换为 export default JSON.parse("..."), 这样会比转译成对象字面量性能更好
  },
  logLevel: 'info', // 日志等级
  plugins: [dts({ include: ['src'] })],
  publicDir: 'public', // public目录位置
  build: {
    // 构建配置: https://cn.vitejs.dev/config/build-options.html
    assetsDir: 'static', // 资源目录
    assetsInlineLimit: 4096, // 小于4kb的资源将会被内联为base64
    copyPublicDir: true, // 拷贝public目录到out文件夹
    chunkSizeWarningLimit: 9000, // 触发警告的chunk大小, kb
    minify: false, // 最小化混淆
    outDir: 'dist', // 输出目录
    reportCompressedSize: false, // gzip压缩大小报告, 禁用可以提高构建速度
    sourcemap: true, // sourcemap
    target: 'es2015' // 打包目标平台
  },
  test: {
    // 测试: https://cn.vitest.dev/config/
    include: ['test/**/*.test.?(c|m)[jt]s?(x)'],
    exclude: ['**/node_modules/**', '**/build/**'],
    globals: true
  }
}

/**
 * @param {*} param0 config
 * @param {string} param0.libName libName
 * @param {string} param0.entry entry
 * @returns {import('vite').UserConfig}
 */
const getLib = ({ libName, entry, exceptDeps }) => ({
  ...base,
  // 共享配置: https://cn.vitejs.dev/config/shared-options.html
  appType: 'custom', // 指定app类型: spa单页应用、mpa多页应用、custom自定义
  build: {
    ...base.build,
    lib: {
      entry,
      formats: ['es'],
      name: libName,
      fileName: 'index'
    }
  },
  plugins: [
    // 外部化模块依赖, 发布库时需要
    // https://github.com/davidmyersdev/vite-plugin-externalize-deps
    externalizeDeps({
      deps: true,
      devDeps: true,
      nodeBuiltins: true,
      peerDeps: true,
      optionalDeps: true,
      except: exceptDeps || []
    }),
    ...base.plugins
  ],
  test: {
    ...base.test,
    environment: 'node'
  }
})

export { base, getLib }
