import React, { useState, useEffect } from 'react'

import { getAllRouteList } from '@scripts/utils'
import { isNull } from 'util'

const getRoutePathList = (routes: IRouteItem[]) =>
  getAllRouteList(routes).map(item => item.path)

export default function hasRoutePath<P extends object>(
  WrapComponent: React.ComponentType<
    P & {
      allRouteList: string[]
    }
  >
): React.FC<P & IRouteProps> {
  return props => {
    const { route } = props
    const { routes } = route
    const [allRouteList, setAllRouteList] = useState<TStringGroup | null>(null)
    useEffect(
      () => {
        setAllRouteList(getRoutePathList(routes))
      },
      [routes]
    )
    return isNull(allRouteList) ? null : (
      <WrapComponent {...props} allRouteList={allRouteList} />
    )
  }
}
