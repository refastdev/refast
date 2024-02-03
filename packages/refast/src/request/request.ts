import type { AxiosInstance, AxiosResponse } from 'axios'
import axios from 'axios'

import {
  EncryptConfig,
  EncryptRequestHeader,
  IsEncryptOption,
  RequestConfig,
  RequestOptions,
  ResponseDataType,
  VOptions,
  VRequest,
  VResponse
} from './types'

const METHOD = {
  GET: 'GET',
  POST: 'POST'
}

export class Request {
  axiosInstance: AxiosInstance
  encrypt?: EncryptConfig

  constructor(config: RequestConfig) {
    const axiosConfig = { ...config }
    if (axiosConfig.encrypt) {
      this.encrypt = axiosConfig.encrypt
      axiosConfig.encrypt = undefined
    }
    if (!axiosConfig.timeout) {
      axiosConfig.timeout = 30000
    }
    if (!axiosConfig.headers) {
      axiosConfig.headers = {}
    }
    if (!axiosConfig.headers.post) {
      axiosConfig.headers.post = {
        'Content-Type': 'application/json'
      }
    }
    this.axiosInstance = axios.create(axiosConfig)
  }
  private async insideRequest(url: string, options: RequestOptions) {
    try {
      return await this.axiosInstance(url, options)
    } catch (e) {
      throw new Error(`request error: ${e}`)
    }
  }
  IsEncrypt() {
    return this.encrypt?.defaultOption.isEncrypt
  }
  async request<T>(
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ResponseDataType<T>> {
    options = options || {}
    options.method = options.method || METHOD.GET

    // 加密请求数据
    const encryptOption = options.encryptOption
    const defaultEncryptOption = this.encrypt?.defaultOption

    let isEncrypt: IsEncryptOption = false
    if (encryptOption && encryptOption.isEncrypt != null) {
      isEncrypt = encryptOption.isEncrypt
    } else if (defaultEncryptOption && defaultEncryptOption.isEncrypt != null) {
      isEncrypt = defaultEncryptOption.isEncrypt
    }
    let isEncryptRequest = false
    let isEncryptResponse = false
    if (typeof isEncrypt === 'boolean') {
      isEncryptRequest = isEncrypt
      isEncryptResponse = isEncrypt
    } else if (typeof isEncrypt === 'object') {
      isEncryptRequest = isEncrypt.isEncryptRequest
      isEncryptResponse = isEncrypt.isEncryptResponse
    }

    if (data != null) {
      if (options.method === METHOD.GET) {
        data = new URLSearchParams(data).toString()
        if (isEncryptRequest) {
          if (this.encrypt && this.encrypt.encrypt) {
            data = this.encrypt.encrypt.encrypt(data)
          } else {
            console.warn('request expects encryption, but encrypt is not configured')
          }
        }
        url = `${url}?${data}`
      } else {
        if (isEncryptResponse) {
          if (this.encrypt && this.encrypt.encrypt) {
            data = this.encrypt.encrypt.encrypt(JSON.stringify(data))
          } else {
            console.warn('request expects encryption, but encrypt is not configured')
          }
        }
        options.data = data
      }
    }

    if (isEncryptRequest) {
      let encryptRequestHeader: EncryptRequestHeader | undefined = undefined
      if (encryptOption && encryptOption.encryptRequestHeader) {
        encryptRequestHeader = encryptOption.encryptRequestHeader
      } else if (defaultEncryptOption && defaultEncryptOption.encryptRequestHeader) {
        encryptRequestHeader = defaultEncryptOption.encryptRequestHeader
      }
      if (encryptRequestHeader) {
        options.headers = options.headers || {}
        options.headers[encryptRequestHeader.key] = encryptRequestHeader.value
      }
    }
    options.url = url
    const response: AxiosResponse<ResponseDataType<T>> = await this.insideRequest(url, options)
    return response.data
  }
  async get(url: string, data?: any, options?: RequestOptions) {
    options = options || {}
    options.method = METHOD.GET
    return this.request<any>(url, data, options)
  }
  async post(url: string, data?: any, options?: RequestOptions) {
    options = options || {}
    options.method = METHOD.POST
    return this.request<any>(url, data, options)
  }

  addRequestInterceptors(
    onFulfilled?: ((value: VRequest) => VRequest | Promise<VRequest>) | null,
    onRejected?: ((error: any) => any) | null,
    options?: VOptions
  ) {
    return this.axiosInstance.interceptors.request.use(onFulfilled, onRejected, options)
  }

  addResponseInterceptors(
    onFulfilled?: ((value: VResponse) => VResponse | Promise<VResponse>) | null,
    onRejected?: ((error: any) => any) | null,
    options?: VOptions
  ) {
    return this.axiosInstance.interceptors.response.use(onFulfilled, onRejected, options)
  }

  /**
  addRequestInterceptors(
    (config: any) => {
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )
  addResponseInterceptors(
    response => {
      return response
    },
    error => {
      return Promise.reject(error)
    }
  )
   */
}
