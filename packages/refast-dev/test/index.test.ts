import { test } from 'vitest';

test('index', async () => {
  const index = await import('../src/index');
  console.log(index);
});
