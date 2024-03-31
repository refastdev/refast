import { useAsyncValue, useLoaderData } from 'react-router-dom';

export function useLoader<T>(): T | undefined {
  const data = useLoaderData();
  if (data) {
    if (typeof data === 'object' && Object.prototype.hasOwnProperty.call(data, '__deferDataFlag')) {
      const originData = (data as any).data;
      if (originData instanceof Promise) {
        return useAsyncValue() as T;
      }
      return originData;
    }
    return data as any;
  }
  return undefined;
}
