import * as React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { isMixTouchEvent, isTouchEvent } from './clamp'

interface InitialState {
  initX: number
  initY: number
  initWidth: number
  initHeight: number
  mouseDownX: number
  mouseDownY: number
}

export const useResize = (
  x: number,
  y: number,
  width: number,
  height: number,
  onResize: (args: {
    x: number
    y: number
    width: number
    height: number
  }) => void
): ((e: React.MouseEvent | React.TouchEvent) => void) => {
  const [dragging, setDragging] = useState(false)
  const [initialDragState, setInitialDragState] = useState<InitialState>({
    initX: 0,
    initY: 0,
    initWidth: 0,
    initHeight: 0,
    mouseDownX: 0,
    mouseDownY: 0
  })

  const onMouseDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      // 判断默认行为是否可以被禁用
      if (e.cancelable) {
        // 判断默认行为是否已经被禁用
        if (!e.defaultPrevented) {
          e.preventDefault()
        }
      }
      const event = isMixTouchEvent(e) ? e.touches[0] : e
      setInitialDragState({
        initX: x,
        initY: y,
        initWidth: width,
        initHeight: height,
        mouseDownX: event.clientX,
        mouseDownY: event.clientY
      })
      setDragging(true)
    },
    [width, height, setDragging, setInitialDragState, x, y]
  )

  useEffect(() => {
    const onMouseMove = (e: MouseEvent | TouchEvent): void => {
      if (dragging) {
        const {
          initX,
          initY,
          initWidth,
          mouseDownX,
          initHeight,
          mouseDownY
        } = initialDragState
        const event = isTouchEvent(e) ? e.touches[0] : e
        let dx = event.clientX - mouseDownX
        let dy = event.clientY - mouseDownY
        const width = initWidth + dx
        const height = initHeight + dy
        return onResize({ x: initX, y: initY, width, height })
      }
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('touchmove', onMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onMouseMove)
    }
  }, [initialDragState, dragging, onResize])

  useEffect(() => {
    const onMouseUp = (): void => {
      setDragging(false)
    }
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchend', onMouseUp)
    return () => {
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchend', onMouseUp)
    }
  }, [setDragging])

  return onMouseDown
}
