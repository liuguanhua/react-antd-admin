import { useEffect, useContext, useState, useCallback, useRef } from 'react'
import { ThemeContext } from '@components/context'

export * from './CoverModal'
export * from './usePrevious'
// export * from "./CoverWait";//放弃使用

//亦可使用use-add-event包
//ref: https://atomizedobjects.com/blog/react/add-event-listener-react-hooks/
// export function useEvent<K extends keyof WindowEventMap>(
//   type: K,
//   listener: (this: Window, ev: WindowEventMap[K]) => any,
//   options?: boolean | AddEventListenerOptions
// ): void {
//   useEffect(() => {
//     window.addEventListener(type, listener, options)
//     return () => {
//       window.removeEventListener(type, listener)
//     }
//   }, [])
// }
//ref:https://usehooks.com/useEventListener/
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (ev: Event) => void,
  element: Window | Element | null = window
): void {
  const savedHandler = useRef(handler)
  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    if (!element || !element.addEventListener) return
    const eventListener = event => savedHandler.current(event)
    element.addEventListener(eventName, eventListener)
    return () => {
      element.removeEventListener(eventName, eventListener)
    }
  }, [eventName, element])
}

export function useTheme() {
  return useContext(ThemeContext)
}

export function useFetchStage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const toggleLoading = useCallback((isLoading: boolean = true) => {
    return () => {
      // return
      setLoading(isLoading)
    }
  }, [])
  const toggleError = useCallback((isError: boolean = true) => {
    return () => {
      setError(isError)
    }
  }, [])
  return {
    loading,
    showLoading: toggleLoading(),
    hideLoading: toggleLoading(false),
    error,
    showError: toggleError(),
    hideError: toggleError(false)
  }
}

export const useStatusDisabled = () => {
  const [disabled, setDisabled] = useState(false)
  const toggleDisabled = useCallback((status: boolean = true) => {
    return () => {
      setDisabled(status)
    }
  }, [])
  return {
    disabled,
    setDisabled: toggleDisabled(),
    cancelDisabled: toggleDisabled(false)
  }
}
