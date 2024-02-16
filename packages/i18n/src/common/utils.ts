import CryptoJS from 'crypto-js';

export function generateShortHash(str: string, length: number) {
  // 使用 SHA-256 生成哈希值
  const hash = CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex);
  // 截断哈希值为指定长度
  const shortHash = hash.substring(0, length);
  return shortHash;
}
