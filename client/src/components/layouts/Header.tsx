import React, { useCallback, useState, useEffect } from 'react'
import { connect } from 'dva'
import classNames from 'classnames'
import { withRouter } from 'react-router-dom'
import { Layout, Icon, Menu, message } from 'antd'

import { SelectParam } from 'antd/lib/menu'
import { RouteComponentProps } from 'react-router-dom'
import { DispatchProp } from 'react-redux'

import styles from '@styles/sass/frame/header.module.scss'

import { goLogoutAccount } from '@scripts/servers'

import SiderBar from './SiderBar'
import ThemeWrapper from './ThemeWrapper'
import {
  BegetPopover,
  BegetThemeContainer,
  BegetMenu
} from '@components/common'
import { usePrevious } from '@components/hooks'
import { clearLoginInfo } from '@root/src/scripts/utils'

const { Header } = Layout
const { ItemGroup } = Menu
const { header, btn_like, popover_menu } = styles
const { enName, publicPath } = window.g_config

const UserCenterMenu: React.FC<IUserInfo & {
  onSelect?: (param: SelectParam) => void
}> = ({ onSelect, userInfo: { userName } }) => {
  return (
    <BegetMenu mode="inline" {...(onSelect && { onSelect })}>
      <ItemGroup title="用户中心">
        <Menu.Item key="setting:1">你好 - {userName}</Menu.Item>
        <Menu.Item key="logout">退出登录</Menu.Item>
      </ItemGroup>
    </BegetMenu>
  )
}

interface IHeaderProps {
  routes: IRouteItem[]
  siderWidth?: number
}
type TAppHeaderProps = IHeaderProps &
  ISharedProps &
  DispatchProp &
  RouteComponentProps &
  IUserInfo

const AppHeader: React.FC<TAppHeaderProps> = ({
  collapsed,
  foldMenu,
  siderWidth = 0,
  userInfo,
  dispatch,
  configInfo = {}
}) => {
  const { isFixedHeader } = configInfo
  const [info, setInfo] = useState(() => {
    const {
      location: { pathname }
    } = window.g_history
    return {
      visible: false,
      pathname
    }
  })
  const { visible } = info
  const { userName = 'admin' } = userInfo
  const sty_header =
    isFixedHeader && !foldMenu
      ? {
          width: `calc(100% - ${siderWidth}px)`
        }
      : {}
  const prevState = usePrevious(info)
  useEffect(() => {
    if (!prevState) return
    const {
      location: { pathname }
    } = window.g_history
    if (foldMenu) {
      !Object.is(pathname, prevState.pathname) &&
        setInfo(v => ({ ...v, visible: false, pathname }))
    } else if (prevState.visible) {
      setInfo(v => ({ ...v, visible: false }))
    }
  }, [foldMenu, prevState])
  const handleVisibleChange = useCallback(visible => {
    setInfo(v => ({ ...v, visible }))
  }, [])
  const userAction = useCallback(({ key }) => {
    switch (key) {
      case 'logout':
        goLogoutAccount().then(() => {
          message.success('退出成功!')
          clearLoginInfo()
        })
        break
      default:
        break
    }
  }, [])
  const toggle = useCallback(() => {
    dispatch({
      type: 'global/upState',
      data: {
        collapsed: !collapsed
      }
    })
  }, [collapsed])
  return (
    <Header
      style={sty_header}
      className={classNames(`${header} locate-fit z2`, {
        'fixed-header': isFixedHeader
      })}
    >
      <BegetThemeContainer showThemeBgColor>
        <div layout-align="space-between center">
          {foldMenu ? (
            <BegetPopover
              placement="bottomLeft"
              overlayClassName={`${popover_menu}`}
              visible={visible}
              overlayStyle={{
                position: 'fixed'
              }}
              onVisibleChange={handleVisibleChange}
              content={<SiderBar />}
            >
              <div className={`cursign font-size-lg tc ${btn_like}`}>
                <Icon type="bars" />
              </div>
            </BegetPopover>
          ) : (
            <div
              className={`cursign tc font-size-lg ${btn_like}`}
              onClick={toggle}
            >
              <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
            </div>
          )}
          <div layout-align="start center">
            <a
              title={enName}
              target="_blank"
              rel="noreferrer noopener"
              href="https://github.com/liuguanhua/react-antd-admin"
            >
              <Icon type="github" />
            </a>
            <span className="header-icon-operate mgl">
              <ThemeWrapper />
            </span>
            <BegetPopover
              overlayClassName="custom-menu-popover"
              content={
                <UserCenterMenu onSelect={userAction} userInfo={userInfo} />
              }
            >
              <span layout-align="start center" className="cursign">
                <Icon className="mglr" type="user" />
                <span className="inline-block mgr anticon">{userName}</span>
                <img
                  className="avatar bdr-half"
                  src={`${publicPath}static/avatar.png`}
                  alt={userName}
                />
              </span>
            </BegetPopover>
          </div>
        </div>
      </BegetThemeContainer>
    </Header>
  )
}

export default (withRouter as any)(
  connect(({ global }) => global)(AppHeader)
) as React.ComponentType<IHeaderProps>
