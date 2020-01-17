import * as React from 'react'
import { Input } from 'antd'

import { InputProps } from 'antd/lib/input'
import { IFrameProps, TComponentKey } from '@scripts/types'

const ComponentFrame: { [key in TComponentKey]: IFrameProps<InputProps> } = {
  Password: {
    wrapComponent: (props: InputProps) => <Input {...props} type="password" />
  },
  Default: {
    wrapComponent: (props: InputProps) => {
      return <Input {...props} />
    }
  }
}

const GetComponent: React.ForwardRefExoticComponent<InputProps & {
  componentType?: TComponentKey
}> = React.forwardRef(({ componentType = 'Default', ...rest }, _) => {
  const { wrapComponent: WrapComponent } = ComponentFrame[componentType]
  return <WrapComponent {...rest} />
})

export default GetComponent
