import CryptoJS from 'crypto-js';
import { test } from 'vitest';

test('index', async () => {
  const index = await import('../src/index');
  console.log(index);

  function generateShortHash(str: string, length: number) {
    // 使用 SHA-256 生成哈希值
    const hash = CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex);
    // 截断哈希值为指定长度
    const shortHash = hash.substring(0, length);
    return shortHash;
  }

  const hash = generateShortHash('LinguiJS example', 6);

  console.log(hash);
});
