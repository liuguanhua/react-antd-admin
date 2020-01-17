import React from 'react'
import { NavLink } from 'react-router-dom'
import withBreadcrumbs, { InjectedProps } from 'react-router-breadcrumbs-hoc'
import { Icon } from 'antd'

import routers from '@scripts/routers'
import { getAllRouteList } from '@scripts/utils'
import { BREADCRUMBS_HEIGHT } from '@scripts/constant'
import equalPaths from '@scripts/equalPaths'

const routes = getAllRouteList(routers).map(item => {
  const { title, path, icon } = item
  return {
    breadcrumb: title,
    path: path,
    icon: icon
  }
})

const findRouteIcon = (path: string): IKeyStringProps =>
  routes.find(item => Object.is(path, item.path)) || {}

const Breadcrumbs = (props: InjectedProps | IKeyStringProps) => {
  let { breadcrumbs } = props
  const lastBread = breadcrumbs[breadcrumbs.length - 1]
  const seriesFlag = lastBread && lastBread.key.split('/').length < 3
  if (seriesFlag) {
    //没有子菜单的菜单不显示首页
    breadcrumbs = [lastBread]
  }
  return (
    <div layout-flex="none" style={{ height: BREADCRUMBS_HEIGHT }}>
      {breadcrumbs.map((breadProps, index: number) => {
        const {
          match: { url,path },
        } = breadProps
        const { icon, breadcrumb } = findRouteIcon(path)
        const BreadSite = (
          <>
            {icon && <Icon type={icon} />}&nbsp;
            {breadcrumb}
          </>
        )
        return (
          <span key={path}>
            {!equalPaths.isHome() && equalPaths.isHome(url) ? (
              <NavLink to={url}>{BreadSite}</NavLink>
            ) : (
              BreadSite
            )}
            {breadcrumb && (
              <span className="mglr">
                {index < breadcrumbs.length - 1 && <i> / </i>}
              </span>
            )}
          </span>
        )
      })}
    </div>
  )
}

export default withBreadcrumbs(routes)(Breadcrumbs)
