import * as React from 'react'
import { useEffect, useMemo, useCallback, memo } from 'react'
import { Modal } from 'antd'
import { ModalProps } from 'antd/lib/modal'
import { ResizeHandle } from './ResizeHandle'
import { useDrag } from './useDrag'
import { DraggableModalContextMethods } from './DraggableModalContext'
import { usePrevious } from './usePrevious'
import {
  ModalID,
  ModalState,
  initialExtendModalProps
} from './draggableModalReducer'
import { useResize } from './useResize'

const modalStyle: React.CSSProperties = {
  margin: 0,
  paddingBottom: 0,
  pointerEvents: 'auto'
}

interface ContextProps extends DraggableModalContextMethods {
  id: ModalID
  modalState: ModalState
}

export type DraggableModalInnerProps = ModalProps & {
  children?: React.ReactNode
} & ContextProps &
  initialExtendModalProps

export const DraggableModalInner = memo(
  ({
    id,
    modalState,
    dispatch,
    visible,
    children,
    title,
    style: fromStyle,
    width: fromWidth,
    wrapClassName: fromWrapClassName,
    extendStyle,
    ...otherProps
  }: DraggableModalInnerProps) => {
    // Call on mount and unmount.
    useEffect(() => {
      dispatch({
        type: 'mount',
        id,
        extendStyle
      })
      return () => dispatch({ type: 'unmount', id })
    }, [dispatch, id])

    // Bring this to the front if it's been opened with props.
    const visiblePrevious = usePrevious(visible)
    useEffect(() => {
      if (visible !== visiblePrevious) {
        if (visible) {
          dispatch({ type: 'show', id })
        } else {
          dispatch({ type: 'hide', id })
        }
      }
    }, [visible, visiblePrevious, id, dispatch])

    const { /* zIndex, */ x, y, width, height } = modalState
    const style: React.CSSProperties = useMemo(
      () => ({
        ...modalStyle,
        top: y,
        left: x,
        height
      }),
      [y, x, height]
    )

    const onFocus = useCallback(() => dispatch({ type: 'focus', id }), [
      id,
      dispatch
    ])

    const onDragWithID = useCallback(
      args => dispatch({ type: 'drag', id, ...args }),
      [dispatch, id]
    )

    const onResizeWithID = useCallback(
      args => dispatch({ type: 'resize', id, ...args }),
      [dispatch, id]
    )

    const onMouseDrag = useDrag(x, y, onDragWithID)
    const onMouseResize = useResize(x, y, width, height, onResizeWithID)

    const titleElement = useMemo(
      () => (
        <div
          className="ant-design-draggable-modal-title"
          onMouseDown={onMouseDrag}
          onTouchStart={onMouseDrag}
          onClick={onFocus}
        >
          {title}
        </div>
      ),
      [onMouseDrag, onFocus, title]
    )
    return (
      <Modal
        wrapClassName={`ant-design-draggable-modal ${fromWrapClassName}`}
        style={{
          ...style,
          ...fromStyle
        }}
        width={width}
        // destroyOnClose
        // mask={false}
        // zIndex={zIndex}
        title={titleElement}
        visible={visible}
        {...otherProps}
      >
        {children}
        <ResizeHandle
          onMouseDown={onMouseResize}
          onTouchStart={onMouseResize}
        />
      </Modal>
    )
  }
)

DraggableModalInner.displayName = 'DraggableModalInner'
