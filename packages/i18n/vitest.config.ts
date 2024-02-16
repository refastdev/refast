import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // 测试: https://cn.vitest.dev/config/
    include: ['test/**/*.test.?(c|m)[jt]s?(x)'],
    exclude: ['**/node_modules/**', '**/build/**'],
    environment: 'node',
    globals: true,
  },
});
