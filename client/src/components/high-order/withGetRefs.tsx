import React from 'react'
import hoistNonReactStatic from 'hoist-non-react-statics'
import { isFunction } from 'util'

export interface IRefsProps {
  withRef?: boolean
  getInstance?: (instance: IKeyStringProps) => void
}

type THocRefsProps<T> = IRefsProps & T

export default function withGetRefs<T>(
  WrappedComponent: React.ComponentType<THocRefsProps<T>>
): React.ComponentClass<THocRefsProps<T>> {
  class HocGetRefs extends React.Component<THocRefsProps<T>> {
    instance: IKeyStringProps = {}
    getInstance = () => this.instance
    setInstance = ref => (this.instance = ref)
    render() {
      const { withRef, getInstance } = this.props
      const flag = isFunction(getInstance) || withRef
      return (
        <WrappedComponent
          {...this.props}
          {...flag && {
            ref: withRef ? this.setInstance : getInstance
          }}
        />
      )
    }
  }
  hoistNonReactStatic(HocGetRefs, WrappedComponent)
  return HocGetRefs
}
