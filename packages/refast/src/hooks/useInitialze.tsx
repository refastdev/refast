import { useEffect, useState } from 'react'

const initFinishDelay = 300

/** 只在初始化一次调用 */
export function useInitialze(onInitialze?: () => void) {
  const initialzed = () => {
    if (onInitialze) {
      onInitialze()
    }
  }
  useEffect(() => {
    setTimeout(initialzed, initFinishDelay)
  }, [])
}

/** 每次重新渲染时调用 */
export function useInitialzeRender(onInitialze?: () => void) {
  const v = useState(false)
  const initialzed = () => {
    if (onInitialze) {
      onInitialze()
    }
  }
  useEffect(() => {
    setTimeout(initialzed, initFinishDelay)
  }, [v])
}
