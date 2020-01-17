import { setRouterLoadingConfig } from '../helper'

export const LOGIN = '/user/login'
export const REGISTER = '/user/register'

export default setRouterLoadingConfig(
  [
    {
      path: LOGIN,
      component: 'user/Login',
      title: '登陆'
    },
    {
      path: REGISTER,
      component: 'user/Register',
      title: '注册'
    }
  ],
  {
    isFullScreen: true
  }
)
