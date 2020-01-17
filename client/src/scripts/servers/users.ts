import request from '../common'
import api from '../common/api'

const {
  verifyIsLogin,
  loginAccount,
  logoutAccount,
  registerAccount,
  getGeoWorld
} = api

//验证用户登陆
export const verifyUserLogin = () => {
  return request({
    url: verifyIsLogin,
    showTips: false
  })
}

//用户登陆
export const goLoginAccount = (data: object) => {
  return request({
    method: 'post',
    url: loginAccount,
    data
  })
}

//用户注册
export const goRegisterAccount = (data: object) => {
  return request({
    method: 'post',
    url: registerAccount,
    data
  })
}

//用户登出
export const goLogoutAccount = () => {
  return request({
    method: 'post',
    url: logoutAccount
  })
}

//获取地图画布
export const fetchGeoWorld = () => {
  return request({
    url: getGeoWorld
  })
}
