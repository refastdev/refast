import CryptoJs from 'crypto-js';

export type Padding = typeof CryptoJs.pad.Pkcs7;
export type BlockCipherMode = typeof CryptoJs.mode.CBC;

export interface EncryptOptions {
  key: string;
  iv: string;
  padding?: Padding;
  mode?: BlockCipherMode;
}

interface RuntimeEncryptOptions {
  KEY: CryptoJs.lib.WordArray;
  IV: CryptoJs.lib.WordArray;
  MODE: BlockCipherMode;
  PADDING: Padding;
}

export class Encrypt {
  runtimeOptions: RuntimeEncryptOptions | undefined = undefined;

  constructor(options: EncryptOptions) {
    this.runtimeOptions = {
      KEY: CryptoJs.enc.Utf8.parse(options.key),
      IV: CryptoJs.enc.Utf8.parse(options.iv),
      MODE: options.mode || CryptoJs.mode.CBC,
      PADDING: options.padding || CryptoJs.pad.Pkcs7,
    };
  }
  /** 加密 */
  encrypt(data: string): string {
    // const dataHex = CryptoJs.enc.Utf8.parse(data);
    if (!this.runtimeOptions) {
      return data;
    }
    // 加密过程
    const encrypted = CryptoJs.AES.encrypt(data, this.runtimeOptions.KEY, {
      iv: this.runtimeOptions.IV,
      mode: this.runtimeOptions.MODE,
      padding: this.runtimeOptions.PADDING,
    });
    // 将加密结果转换为 Base64 字符串
    return encrypted.toString();
  }
  /** 解密 */
  decrypt(data: string): string {
    if (!this.runtimeOptions) {
      return data;
    }
    // const encryptHexStr = CryptoJs.enc.Hex.parse(data);
    // const str = CryptoJs.enc.Base64.stringify(encryptHexStr);
    const decrypted = CryptoJs.AES.decrypt(data, this.runtimeOptions.KEY, {
      iv: this.runtimeOptions.IV,
      mode: this.runtimeOptions.MODE,
      padding: this.runtimeOptions.PADDING,
    });
    return decrypted.toString(CryptoJs.enc.Utf8);
  }
}
