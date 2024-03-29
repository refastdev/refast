import { useAsyncValue, useLoaderData } from 'react-router-dom';

export function useLoader<T>(): T | undefined {
  const data = useLoaderData();
  if (data) {
    return (data as any).data;
  }
  return undefined;
}

export function useAsyncLoader<T>(): T | undefined {
  return useAsyncValue() as T;
}
