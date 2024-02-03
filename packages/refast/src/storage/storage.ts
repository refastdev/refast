import { Encrypt } from '../utils/encrypt'

export type StorageType = 'localStorage' | 'sessionStorage'

export interface StorageOptions {
  encrypt?: Encrypt
  keyPrefix?: string
  type: StorageType
}

const getIsSupport = (storageType: StorageType) => {
  if (!window) {
    return false
  }
  if (storageType === 'localStorage' && !window.localStorage) {
    return false
  }
  if (storageType === 'sessionStorage' && !window.sessionStorage) {
    return false
  }
  return true
}

export class StorageData {
  private encrypt?: Encrypt
  private keyPrefix: string
  private type: StorageType
  private readonly support: boolean

  constructor({ encrypt, keyPrefix, type }: StorageOptions) {
    this.encrypt = encrypt
    this.keyPrefix = keyPrefix || ''
    this.type = type
    this.support = getIsSupport(type)
    if (!this.support) {
      console.warn(`not support ${this.type}`)
    }
  }

  private getStorage() {
    return window[this.type]
  }

  private getKey(key: string) {
    return this.keyPrefix + key
  }

  public setKeyPrefix(keyPrefix?: string) {
    this.keyPrefix = keyPrefix || ''
  }

  /** 序列化数据 */
  private serializeData(value: any): string {
    const json = JSON.stringify(value)
    return this.encrypt ? this.encrypt.encrypt(json) : json
  }

  /** 反序列化数据 */
  private deserializeData(data: string | null): any {
    if (data == null) return null
    const json = this.encrypt ? this.encrypt.decrypt(data) : data
    return JSON.parse(json)
  }

  /** 设置数据 */
  public set(key: string, value: any) {
    if (!this.support) return
    if (!value) value = null
    const data = this.serializeData(value)
    const storageKey = this.getKey(key)
    this.getStorage().setItem(storageKey, data)
  }

  /** 获取数据 */
  public get(key: string): any {
    if (!this.support) return null
    if (!key) return null
    const data = this.getStorage().getItem(this.getKey(key))
    if (data == null) return null
    return this.deserializeData(data)
  }

  /** 是否存在 */
  public has(key: string): boolean {
    if (!this.support) return false
    if (!key) return false
    return this.getStorage().getItem(this.getKey(key)) == null
  }

  /** 删除数据 */
  public delete(key: string) {
    if (!this.support) return
    this.getStorage().removeItem(this.getKey(key))
  }

  /** 清空数据 */
  public clear() {
    if (!this.support) return
    this.getStorage().clear()
  }

  /**
   * 获取所有数据
   * @returns {{ [x: string]: string }}
   */
  public all(): { [x: string]: string } {
    if (!this.support) return {}
    const storage = this.getStorage()
    const length = storage.length
    const result: { [x: string]: string } = {}
    for (let i = 0; i < length; i++) {
      const key = storage.key(i)
      if (key == null) continue
      result[key] = this.get(key)
    }
    return result
  }
}

export interface OmitStorageOptions extends Omit<StorageOptions, 'type'> {}

export class LocalStorageData extends StorageData {
  constructor(options?: OmitStorageOptions) {
    options = options || {}
    super({
      ...options,
      type: 'localStorage'
    })
  }
}

export class SessionStorageData extends StorageData {
  constructor(options?: OmitStorageOptions) {
    options = options || {}
    super({
      ...options,
      type: 'sessionStorage'
    })
  }
}
