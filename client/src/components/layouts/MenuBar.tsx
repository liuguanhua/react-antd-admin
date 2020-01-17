import React, { useContext, useCallback, useState, useEffect } from 'react'
import { connect } from 'dva'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd'

import { RouteComponentProps } from 'react-router-dom'

import { splitPathList, authRoutePage, getSearchValues } from '@scripts/utils'
import { CtxMenu } from '@components/context'
import { BegetMenu } from '../common'
import { usePrevious } from '../hooks'

const { SubMenu } = Menu

const toPathParams = (
  path: string,
  isCarryPath?: boolean,
  search?: string
): {
  pathname: string
  search?: string
} => {
  let searchValue = {}
  if (isCarryPath && search) {
    searchValue = {
      search: `${search}&carry_path=${path}`
    }
  } else if (isCarryPath || search) {
    searchValue = {
      search: search || `?carry_path=${path}`
    }
  }
  return {
    pathname: path,
    ...searchValue
  }
}

const getMenuKeys = (routes: IRouteItem[]) => {
  return routes.reduce((info, item) => {
    if (item.routes) {
      info = [...info, item.path]
    }
    return info
  }, [] as string[])
}

const MenuList = (rootRoutes: IRouteItem[], userInfo: IUserInfoProps = {}) => {
  //生成菜单列表
  return rootRoutes
    .filter(item => item.title && !item.navHide)
    .map(item => {
      const hasAuth = authRoutePage(item, userInfo)
      if (!hasAuth) return null
      const { routes, path, icon, title, search, isCarryPath } = item
      const ItemTitle = (
        <>
          {icon && <Icon type={icon} />}
          <span>{title}</span>
        </>
      )
      if (routes) {
        return (
          <SubMenu key={path} title={ItemTitle}>
            {MenuList(routes, userInfo)}
          </SubMenu>
        )
      }
      const toPath = toPathParams(path, isCarryPath, search)
      return (
        <Menu.Item key={path}>
          <Link to={toPath}>{ItemTitle}</Link>
        </Menu.Item>
      )
    })
}

const MenuBar: React.FC<ISharedProps & RouteComponentProps> = ({
  location: { pathname },
  userInfo,
  collapsed = false,
  foldMenu
}) => {
  const { routes } = useContext(CtxMenu)
  const carryPath = getSearchValues('carry_path')
  const openKeysInfo = splitPathList(carryPath || pathname)
  const [info, setInfo] = useState(() => {
    return {
      openKeys: collapsed && !foldMenu ? [] : openKeysInfo,
      collapsed,
      saveKeys: openKeysInfo,
      pathname
    }
  })
  const { openKeys } = info
  const prevState = usePrevious(info)
  if (!Object.is(collapsed, info.collapsed)) {
    setInfo(v => ({
      ...v,
      openKeys: collapsed ? [] : info.saveKeys, //伸缩及展开选中的导航
      collapsed
    }))
  }
  useEffect(() => {
    if (foldMenu || !prevState) return
    //监听路由变化设置导航
    if (!Object.is(pathname, prevState.pathname)) {
      setInfo(v => ({
        ...v,
        saveKeys: openKeys,
        //解决菜单折叠模式下切换路由没有隐藏及移动和pc切换导航高亮不对问题
        ...((foldMenu || !collapsed) && {
          openKeys
        }),
        pathname
      }))
    }
  }, [foldMenu, collapsed, pathname, prevState])

  const onOpenChange = useCallback(
    expandKeys => {
      const rootSubmenuKeys = getMenuKeys(routes)
      const latestOpenKey = expandKeys.find(key => !openKeys.includes(key))
      if (!rootSubmenuKeys.includes(latestOpenKey)) {
        return setInfo(v => ({
          ...v,
          openKeys: expandKeys
        }))
      }
      setInfo(v => ({
        ...v,
        openKeys: latestOpenKey ? [latestOpenKey] : []
      }))
    },
    [routes, openKeys]
  )

  return (
    <BegetMenu
      style={{
        height: 'calc(100vh - 150px)',
        overflowX: 'hidden',
        paddingBottom: 50
      }}
      onOpenChange={onOpenChange}
      mode="inline"
      selectedKeys={[carryPath || pathname || '']}
      openKeys={openKeys}
    >
      {routes && MenuList(routes, userInfo)}
    </BegetMenu>
  )
}

// ref: https://stackoverflow.com/questions/53240058/use-hoist-non-react-statics-with-withrouter
export default withRouter(connect(({ global }) => global)(MenuBar))
