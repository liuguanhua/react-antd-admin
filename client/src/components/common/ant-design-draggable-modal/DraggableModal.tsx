import React from 'react'
import { useContext } from 'react'
import { useUID } from 'react-uid'
import { DraggableModalContext } from './DraggableModalContext'
import { DraggableModalInner } from './DraggableModalInner'
import { getModalState, initialExtendModalProps } from './draggableModalReducer'
import { ModalProps } from 'antd/lib/modal'
import './DraggableModal.css'

// export type DraggableModalProps = ModalProps
export type DraggableModalProps = ModalProps & {
  children?: React.ReactNode
} & initialExtendModalProps

export const DraggableModal = (
  props: DraggableModalProps
): React.ReactElement => {
  // Get the unique ID of this modal.
  const id = useUID()

  // Get modal provider.
  const modalProvider = useContext(DraggableModalContext)
  if (!modalProvider) {
    throw new Error('No Provider')
  }

  const { dispatch, state } = modalProvider
  const modalState = getModalState(state, id)

  // We do this so that we don't re-render all modals for every state change.
  // DraggableModalInner uses React.memo, so it only re-renders if
  // if props change (e.g. modalState).
  return (
    <DraggableModalInner
      id={id}
      dispatch={dispatch}
      modalState={modalState}
      {...props}
    />
  )
}
