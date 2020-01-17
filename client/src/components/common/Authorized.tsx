import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { connect } from 'dva'
import { withRouter } from 'react-router-dom'

import { authRoutePage } from '@scripts/utils'

import Exception from './Exception'

type IAuthorizedProps = RouteComponentProps & IUserInfo

const Authorized: React.FC<IAuthorizedProps> = props => {
  const {
    children,
    location: { pathname },
    userInfo
  } = props
  const hasAuth = authRoutePage(pathname, userInfo)
  return hasAuth ? <>{children}</> : <Exception status="403" />
}

export default withRouter(connect(({ global }) => global)(Authorized))
