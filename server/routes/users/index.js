const express = require('express')
const router = express.Router()
const { Random } = require('mockjs')

const {
  USER_SESSION,
  USER_COOKIE,
  PASSWORD,
  TEMP_USER_LENGTH
} = require('../../scripts/constant')
const { responseData } = require('../../scripts/utils')
let userList = []

const saveUserInfo = function(data) {
  // const { userId } = data
  // if (userList.length >= TEMP_USER_LENGTH) {
  //   userList.shift()
  // }
  // userList = [...userList, data]
  this.cookie(USER_COOKIE, data, {
    signed: true,
    sameSite: 'lax'
  })
}

router.get('/verifyIsLogin', function(req, res) {
  const data = req.signedCookies[USER_COOKIE] //req.session[USER_SESSION]
  if (data && data.userId) {
    return res.send(
      responseData({
        data
      })
    )
  }
  res.send(
    responseData({
      code: 401,
      msg: '未登录'
    })
  )
})

router.post('/login/account', function(req, res, next) {
  const { password, userName } = req.body
  if (true || Object.is(password, PASSWORD)) {
    //不校验密码
    const isAdmin = Object.is(userName, 'admin')
    const userId = Random.guid()
    const data = {
      userName,
      userId,
      authority: isAdmin ? userName : 'user'
    }
    saveUserInfo.call(res, data)
    return res.send(
      responseData({
        data
      })
    )
    return req.session.regenerate(function(err) {
      //重新生成session会话
      if (err) {
        return res.send(
          responseData({
            code: 500
          })
        )
      }
      req.session[USER_SESSION] = data
      res.send(
        responseData({
          data
        })
      )
    })
  }
  res.send(
    responseData({
      code: 403,
      msg: '账号或密码不对'
    })
  )
})

router.post('/register/account', function(req, res, next) {
  const { mobile } = req.body
  const regex = /(\d{3})\d{4}(\d{4})/
  const userId = Random.guid()
  const data = {
    userName: mobile.replace(regex, '$1****$2'),
    userId,
    authority: 'user'
  }
  saveUserInfo.call(res, data)
  return res.send(
    responseData({
      data
    })
  )
  return req.session.regenerate(function(err) {
    if (err) {
      return res.send(
        responseData({
          code: 500
        })
      )
    }
    req.session[USER_SESSION] = data
    res.send(
      responseData({
        data
      })
    )
  })
})

router.post('/logout/account', function(req, res, next) {
  //req.session.cookie.maxAge=0;
  // res.clearCookie(USER_COOKIE, { maxAge: 0 }) //设置cookie的过期时间为0，直接过期
  const userId = req.signedCookies[USER_COOKIE]
  res.cookie(USER_COOKIE, '', { expires: new Date(0) })
  return res.send(
    responseData({
      msg: '退出成功'
    })
  )
  req.session.destroy(function(err) {
    //销毁session
    if (err) {
      return res.send(
        responseData({
          code: 500,
          msg: '退出失败'
        })
      )
    }
    res.clearCookie(USER_COOKIE, { maxAge: 0 })
    res.send(
      responseData({
        msg: '退出成功'
      })
    )
    // res.redirect('/')
  })
})

module.exports = router
