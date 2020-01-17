import React from 'react'
import { connect } from 'dva'
import { throttle } from 'throttle-debounce'
import { Layout } from 'antd'

import { DispatchProp } from 'react-redux'

import { SIDER_WIDTH, COLLAPSED_SIDER_WIDTH } from '@scripts/constant'
import { isMobile } from '@scripts/helper'

import {
  injectLocaleLang,
  hasRoutePath,
  withAuthRoute
} from '@components/high-order'
import Breakcrumbs from '@components/breakcrumbs'
import { Authorized } from '@components/common'
import { useEventListener } from '@components/hooks'
import { CtxMenu } from '@components/context'
import { Header, SiderBar } from '@components/layouts'

const { Content } = Layout

const App: React.FC<DispatchProp & IRouteProps & ISharedProps> = props => {
  const {
    foldMenu,
    dispatch,
    children,
    collapsed,
    route: { routes },
    configInfo = {}
  } = props
  const { isFixedSider, isFixedHeader } = configInfo
  useEventListener(
    'resize',
    throttle(1000, () => {
      if (isMobile()) {
        return (
          !foldMenu &&
          dispatch({
            type: 'global/upState',
            data: {
              foldMenu: true
            }
          })
        )
      }
      return (
        foldMenu &&
        dispatch({
          type: 'global/upState',
          data: {
            foldMenu: false
          }
        })
      )
    })
  )
  const siderWidth = collapsed ? COLLAPSED_SIDER_WIDTH : SIDER_WIDTH
  const sty_insideLayout =
    isFixedSider && !foldMenu
      ? {
          paddingLeft: siderWidth
        }
      : {}
  return (
    <Layout className="min-h-100">
      <CtxMenu.Provider value={{ routes }}>
        {!foldMenu && <SiderBar />}
        <Layout style={sty_insideLayout} className="layout-inside-container">
          <Header siderWidth={siderWidth} routes={routes} />
          <Content
            flex-direction="column"
            style={{
              ...(isFixedHeader && {
                paddingTop: 79
              })
            }}
            className="inside-padding-container"
          >
            <div
              layout-flex="flex"
              flex-direction="column"
              className="min-h-100 h-100"
            >
              <Authorized>
                <Breakcrumbs />
                {children}
              </Authorized>
            </div>
          </Content>
        </Layout>
      </CtxMenu.Provider>
    </Layout>
  )
}

/**
 * 如需使用装饰器的方式，类型声明参考
 * https://github.com/DefinitelyTyped/DefinitelyTyped/issues/9951
 * https://github.com/DefinitelyTyped/DefinitelyTyped/issues/24077
 */
export default withAuthRoute()(
  connect(({ global }) => global)(injectLocaleLang(hasRoutePath(App)))
)
// export default connect(({ global }) => global)(
//   injectLocaleLang(hasRoutePath(App))
// )
