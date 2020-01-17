import { useRef, useEffect } from 'react'

export const usePrevious = <T>(value: T): T | null => {
    const ref = useRef<T>(null)
    useEffect(() => {
        // @ts-ignore
        ref.current = value
    })
    return ref.current
}
