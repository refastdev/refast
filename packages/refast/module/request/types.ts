import type {
  AxiosInterceptorOptions,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';

import type { Encrypt } from '../encrypt';

// Encrypt
export type IsEncryptOption =
  | boolean
  | {
      isEncryptRequest: boolean;
      isEncryptResponse: boolean;
    };

export interface EncryptRequestHeader {
  key: string;
  value: string;
}

export interface EncryptOption {
  /**
   * is encrypt
   */
  isEncrypt: IsEncryptOption;
  /**
   * encrypt request header
   */
  encryptRequestHeader?: EncryptRequestHeader;
}

export type EncryptConfig = {
  /**
   * encrypt object
   */
  encrypt: Encrypt;
  defaultOption: EncryptOption;
};

export type RequestConfig = {
  /**
   * encrypt
   */
  encrypt?: EncryptConfig;
  /**
   * baseUrl, Examples: https://api.example.com:8080/v1/
   */
  baseURL?: string;
  /**
   * timeout, default: 30000 Milliseconds
   */
  timeout?: number;
} & CreateAxiosDefaults;

export interface RequestOptions extends AxiosRequestConfig {
  encryptOption?: EncryptOption;
  [key: string]: any;
}

// Response
export interface ResponseDataType<T> {
  code: number;
  data: T;
}

export type VRequest = InternalAxiosRequestConfig;
export interface VResponse extends AxiosResponse<ResponseDataType<any>> {
  config: InternalAxiosRequestConfig & RequestOptions;
}
export type VOptions = AxiosInterceptorOptions;
