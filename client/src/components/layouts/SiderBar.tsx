import React from 'react'
import { connect } from 'dva'
import classNames from 'classnames'
import { Link, withRouter } from 'react-router-dom'

import styles from '@styles/sass/frame/layout.module.scss'

import { SIDER_WIDTH } from '@scripts/constant'
import { HOME } from '@scripts/routers'

import MenuBar from './MenuBar'
import { BegetSider } from '@components/common'

const { logo, name } = window.g_config
const { sider_logo } = styles

const SiderBar: React.FC<ISharedProps> = ({
  foldMenu,
  collapsed,
  configInfo = {}
}) => {
  const { isFixedSider } = configInfo
  return foldMenu ? (
    <MenuBar />
  ) : (
    <BegetSider
      className={classNames('layout-sider-container', {
        'fixed-sider-menu': isFixedSider
      })}
      width={SIDER_WIDTH}
      trigger={null}
      collapsible
      collapsed={collapsed}
    >
      <Link to={HOME} layout-align="center center" className={sider_logo}>
        <img alt={name} className="logo" src={logo} title={name} />
        {!collapsed && (
          <span className="font-size-xl font-weight-bold">{name}</span>
        )}
      </Link>
      <MenuBar />
    </BegetSider>
  )
}

export default withRouter(connect(({ global }) => global)(SiderBar))
