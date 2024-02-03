import { useLoaderData } from 'react-router-dom'
import type { LoaderFunction } from 'react-router-dom'

export type LoaderFn = LoaderFunction

export function useLoader<T>(): T {
  return useLoaderData() as T
}
