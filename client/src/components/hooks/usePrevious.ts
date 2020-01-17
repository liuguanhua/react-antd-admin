import { useRef, useEffect } from 'react'
export function usePrevious<T = undefined>(v: T): T
export function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}
