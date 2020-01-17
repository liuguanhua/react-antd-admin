import * as React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { isMixTouchEvent, isTouchEvent } from './clamp'

export const useDrag = (
  x: number,
  y: number,
  onDrag: (args: { x: number; y: number }) => void
): ((e: React.MouseEvent | React.TouchEvent) => void) => {
  const [dragging, setDragging] = useState(false)
  const [initialDragState, setInitialDragState] = useState({
    initX: 0,
    initY: 0,
    mouseDownX: 0,
    mouseDownY: 0
  })
  const onPreventDefault = useCallback(
    (e: React.MouseEvent | MouseEvent | React.TouchEvent | TouchEvent) => {
      // event.cancelable 浏览器默认行为是否可以被禁用
      // event.defaultPrevented 浏览器默认行为是否已经被禁用
      // 判断默认行为是否可以被禁用
      if (e.cancelable) {
        // 判断默认行为是否已经被禁用
        if (!e.defaultPrevented) {
          e.preventDefault()
        }
      }
    },
    []
  )
  const onMouseDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      onPreventDefault(e)
      const event = isMixTouchEvent(e) ? e.touches[0] : e
      setInitialDragState({
        initX: x,
        initY: y,
        mouseDownX: event.clientX,
        mouseDownY: event.clientY
      })
      setDragging(true)
    },
    [x, y, setDragging, setInitialDragState]
  )

  useEffect(() => {
    const onMouseMove = (e: MouseEvent | TouchEvent): void => {
      if (dragging) {
        const { initX, mouseDownX, initY, mouseDownY } = initialDragState
        const event = isTouchEvent(e) ? e.touches[0] : e
        let dx = event.clientX - mouseDownX
        let dy = event.clientY - mouseDownY
        const x = initX + dx
        const y = initY + dy
        onDrag({ x, y })
      }
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('touchmove', onMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onMouseMove)
    }
  }, [initialDragState, dragging, onDrag])

  useEffect(() => {
    const onMouseUp = (e: MouseEvent | TouchEvent): void => {
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
