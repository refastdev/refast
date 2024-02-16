import { useEffect, useState } from 'react';

const initFinishDelay = 300;

/** 只在初始化一次调用 */
export function useInitialze(
  onInitialze?: () => void,
  delay: number | undefined = initFinishDelay,
) {
  const initialzed = () => {
    if (onInitialze) {
      onInitialze();
    }
  };
  useEffect(() => {
    if (delay <= 0 || delay === undefined) {
      initialzed();
    } else {
      setTimeout(initialzed, delay);
    }
  }, []);
}

/** 每次重新渲染时调用 */
export function useInitialzeRender(
  onInitialze?: () => void,
  delay: number | undefined = initFinishDelay,
) {
  const v = useState(false);
  const initialzed = () => {
    if (onInitialze) {
      onInitialze();
    }
  };
  useEffect(() => {
    if (delay <= 0 || delay === undefined) {
      initialzed();
    } else {
      setTimeout(initialzed, delay);
    }
  }, [v]);
}
