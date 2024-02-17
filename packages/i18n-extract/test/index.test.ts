import { test } from 'vitest';

test('index', async () => {
  const index = await import('../src/index');
  const result = await index.default({
    sourcePath: './test-files',
    outputPath: './test-files/en-US.json',
  });
  const count = (result && result.length) || 0;
  console.log(`${count} messages extracted.`);
});
