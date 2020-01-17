import { useState, useCallback } from 'react'

export type TShowModal = () => void
export type THideModal = () => void

export interface IUseModalEmitProps {
  showModal: TShowModal
  hideModal: THideModal
}

export const useModal = (
  initStatus: boolean = false
): [boolean, IUseModalEmitProps] => {
  const [visible, setVisible] = useState(initStatus)
  const toggle = useCallback((status: boolean = true) => {
    setVisible(status)
  }, [])
  return [
    visible,
    {
      showModal: () => {
        toggle()
      },
      hideModal: () => {
        toggle(false)
      }
    }
  ]
}
