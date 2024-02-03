import { Suspense as _Suspense, useRef as _useRef } from 'react'
import type { INTERNAL_Snapshot } from 'valtio'
import {
  proxy as _proxy,
  ref as _ref,
  snapshot as _snapshot,
  subscribe as _subscribe,
  useSnapshot as _useSnapshot
} from 'valtio'
import { subscribeKey as _subscribeKey, useProxy as _useProxy } from 'valtio/utils'

export type Snapshot<T> = INTERNAL_Snapshot<T>
export type SubCallback = Parameters<typeof _subscribe>[1]
export type AsRef = ReturnType<typeof _ref>
export type HandlePromise = Parameters<typeof _snapshot>[1]

export type UseSnapshotOptions = Parameters<typeof _useSnapshot>[1]
export type UseProxyOptions = NonNullable<Parameters<typeof _useSnapshot>[1]>
/**
 * subscribeKey
 * 订阅代理的原始值改变事件
 *
 * The subscribeKey utility enables subscription to a primitive subproperty of a given state proxy.
 * Subscriptions created with subscribeKey will only fire when the specified property changes.
 * notifyInSync: same as the parameter to subscribe(); true disables batching of subscriptions.
 *
 * @example
 * subscribeKey(state, 'count', (v) => console.log('state.count has changed to', v))
 */
export function subscribeKey<T extends object, K extends keyof T>(
  proxyObject: T,
  key: K,
  callback: (value: T[K]) => void,
  notifyInSync?: boolean
): () => void {
  return _subscribeKey(proxyObject, key, callback, notifyInSync)
}

export function proxy<T extends object>(initialObject?: T): T {
  return _proxy(initialObject)
}

export function ref<T extends object>(obj: T): T & AsRef {
  return _ref(obj)
}

export function snapshot<T extends object>(
  proxyObject: T,
  handlePromise?: HandlePromise
): Snapshot<T> {
  return _snapshot(proxyObject, handlePromise)
}

export function subscribe<T extends object>(
  proxyObject: T,
  callback: SubCallback,
  notifyInSync?: boolean
): () => void {
  return _subscribe(proxyObject, callback, notifyInSync)
}

export const AsyncData = _Suspense

export function useRef<T extends object>(initialObject?: T): T {
  return _useRef(_proxy(initialObject)).current
}

export function useSnapshot<T extends object>(
  proxyObject: T,
  options?: UseSnapshotOptions
): Snapshot<T> {
  return _useSnapshot(proxyObject, options)
}

export function useProxy<T extends object>(proxy: T, options?: UseProxyOptions): T {
  return _useProxy(proxy, options)
}
