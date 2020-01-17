import * as React from 'react'
import errorHandlerHoc from 'error-handler-hoc'

import { HOME } from '@scripts/routers'

const FallBackComponent = () => {
  return (
    <div className="h-100" layout-align="space-between center">
      <div className="w-100 tc">
        <h2>操作期间发生了错误，请联系管理人员!</h2>
        <h3>
          <a href={HOME}>去首页</a>
        </h3>
      </div>
    </div>
  )
}

export default errorHandlerHoc(console.log, FallBackComponent)
