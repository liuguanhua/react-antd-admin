import userRouters from './userRouters'
import mainRouters, { HOME } from './mainRouters'
import { setRouterLoadingConfig } from '../helper'

export * from './userRouters'
export * from './mainRouters'

const router = setRouterLoadingConfig(
  [
    // user
    {
      path: '/user',
      component: 'layouts/Mine',
      component_from: 'components',
      routes: userRouters
    },
    //main
    {
      path: HOME,
      component: 'App',
      routes: mainRouters
    }
  ],
  {
    isFullScreen: true
  }
)

/**
 * 路径全部使用小写
 * @param {IRouteItemMinor[]} data
 * @returns
 */
const toLowerCaseRouterPath = (data: IRouteItemMinor[]) =>
  data.map(v => {
    if (v.routes) {
      v.routes = toLowerCaseRouterPath(v.routes)
    }
    v.path = (v.path || '').toLowerCase()
    return v
  })

export default toLowerCaseRouterPath(router)
