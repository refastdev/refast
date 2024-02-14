import { chunkSplitOptions } from './chunkSplitOptions';
import type { RefastPluginOptions } from './types';

export const defaultOptions: RefastPluginOptions = {
  appType: 'react',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV !== 'production',
  generateRoutes: {
    open: false,
  },
  legacy: {
    open: false,
    options: {
      // 旧浏览器支持
      targets: ['defaults', 'not IE <= 11', 'ios >= 9'],
    },
  },
  compression: {
    open: true,
    options: {
      verbose: true,
      disable: false,
      threshold: 1025, // 大于此大小的文件会被压缩
      algorithm: 'gzip',
      ext: '.gz',
    },
  },
  visualizer: {
    open: true,
    options: {
      // 打包分析
      filename: './dist/analyze/analyze.html',
      title: 'analyze',
      template: 'treemap',
      open: false,
    },
  },
  vconsole: {
    open: false,
    options: {
      enabled: true,
      localEnabled: true,
      entry: 'src/index.tsx',
      config: {
        log: {
          maxLogNumber: 1000,
          showTimestamps: true,
        },
        theme: 'light',
        onReady() {
          console.log('vconsole init success');
        },
      },
    },
  },
  chunkSplit: {
    open: true,
    options: chunkSplitOptions,
  },
  reactOptions: {},
  preactOptions: {},
};
