import React from 'react'
import { Spin, Icon } from 'antd'
import classNames from 'classnames'

interface ILoadPage {
  isHide?: boolean
  isFullScreen?: boolean
  style?: React.CSSProperties
  className?: string
  size?: 'large'
  iconStyle?: React.CSSProperties
}

const LoadPage: React.FC<ILoadPage> = ({
  isHide,
  isFullScreen,
  style = {},
  className = '',
  size,
  iconStyle,
  children
}) => {
  const newIconStyle = iconStyle || {
    fontSize: Object.is(size, 'large') ? 40 : 24
  }
  return (
    <div
      style={style}
      className={classNames(`tc ${className}`, {
        'load-container': isFullScreen,
        hide: isHide
      })}
    >
      <Spin indicator={<Icon type="loading" style={newIconStyle} spin />} />
      {children}
    </div>
  )
}

LoadPage.defaultProps = {
  isHide: false,
  isFullScreen: false
}

export default LoadPage
