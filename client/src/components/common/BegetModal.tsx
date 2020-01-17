import React from 'react'

import { ModalProps } from 'antd/lib/modal'
import { initialExtendModalProps } from './ant-design-draggable-modal/draggableModalReducer'

import { MODAL_INIT_WIDTH } from '@scripts/constant'

import { DraggableModal } from './ant-design-draggable-modal'

interface IBegetModalProps extends ModalProps, initialExtendModalProps {
  size?: 'default' | 'large'
}

//ref:https://github.com/DylanVann/ant-design-draggable-modal
export const BegetModal: React.FC<IBegetModalProps> = ({
  children,
  bodyStyle,
  size = 'default',
  extendStyle = {},
  ...rest
}) => {
  return (
    <DraggableModal
      // bodyStyle={{ maxHeight: 600, overflowY: 'auto', ...bodyStyle }}
      extendStyle={{
        ...(Object.is(size, 'large') && {
          width: MODAL_INIT_WIDTH
        }),
        ...extendStyle
      }}
      {...rest}
    >
      {children}
    </DraggableModal>
  )
}
