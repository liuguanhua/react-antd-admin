import * as React from 'react'
import { connect } from 'dva'
import { isUndefined } from 'util'

import { DispatchProp } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'

import { verifyUserLogin } from '@scripts/servers'
import { LOGIN, REGISTER, HOME } from '@scripts/routers'

import LoadPage from '@components/common/LoadPage'

type IUseAuthRouteProps = IUserInfo & DispatchProp & RouteComponentProps

const withAuthRoute = <P extends object = {}>() => {
  return function AuthRouteCompt(
    WrapComponent: React.ComponentType<P>
  ): React.ComponentClass<P> {
    @connect(({ global }) => global)
    class UseAuthRoute extends React.Component<P & IUseAuthRouteProps> {
      isLoginOrRegPage: boolean
      constructor(props) {
        super(props)
        const {
          location: { pathname }
        } = props
        this.isLoginOrRegPage = [LOGIN, REGISTER].includes(pathname)
      }
      async componentDidMount() {
        const { history, dispatch } = this.props
        try {
          const userInfo = await verifyUserLogin()
          dispatch({
            type: 'global/upState',
            data: {
              userInfo
            }
          })
          this.isLoginOrRegPage && history.push(HOME)
        } catch (error) {
          !this.isLoginOrRegPage && history.push(LOGIN)
        }
      }
      render() {
        const {
          userInfo: { userId }
        } = this.props
        return isUndefined(userId) && !this.isLoginOrRegPage ? (
          <LoadPage size="large" isFullScreen />
        ) : (
          <WrapComponent {...this.props} />
        )
      }
    }
    return UseAuthRoute
  }
}

export default withAuthRoute
