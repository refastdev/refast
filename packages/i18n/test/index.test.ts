import { test } from 'vitest';

test('index', async () => {
  const { generateTextId, formatString } = await import('../src/utils');
  const hash = generateTextId('test');
  console.log(hash);
  const format = formatString('{{test}}, {name}, {good}, {name}, {x}, {x}', {
    name: '{good}',
    good: 'good',
    x: 'x',
    test: 'ttt',
  });
  console.log(format);
  // console.log((await import('../src/core')).i18n.codes);
});
