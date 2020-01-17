const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

// const cors = require('cors')
const session = require('express-session')
// const redis = require('redis')
// const redisStore = require('connect-redis')(session)
// const redisClient = redis.createClient()

const moment = require('moment')
// const ejs = require('ejs')
require('moment/locale/zh-cn')
const {
  IDENTITY_KEY,
  USER_SESSION,
  USER_COOKIE,
  REQUEST_TIMEOUT,
  COOKIE_SECRET
} = require('./scripts/constant')
const { responseData } = require('./scripts/utils')
const app = express()
const allowedOrigin = [
  'http://localhost:8888',
  'http://fe.lhh.now.sh:8888',
  'http://fe-lhh.now.sh:8888',
  'http://lgh.github.io:8888',
  'http://localhost:5000',
  'https://react-antd-admin.lhh.now.sh',
  'https://liuguanhua.github.io'
]

moment.locale('zh-cn')
// app.use(
//   session({
//     secret: COOKIE_SECRET, //生成session的签名
//     name: IDENTITY_KEY, //session ID cookie的名称，默认为connect.sid
//     cookie: {
//       domain: 'lhh.now.sh',
//       // domain: 'lhh.now.sh'
//       secure: false, //true https情况才能访问
//       // httpOnly: true, //不允许客户端JavaScript查看cookie
//       maxAge: 24 * 60 * 60 * 1000 //有效期，单位是毫秒
//     },
// store: new redisStore({
//   host: 'localhost',
//   port: 6379,
//   client: redisClient,
//   ttl: 86400
// }),
//   resave: false, //是否每次都重新保存会话，建议false,true会影响性能。
//   saveUninitialized: true, //是否自动保存未初始化的会话
//   rolling: true //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
// })
/*  cors({
    origin: allowedOrigin,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
  }) */
// )

// view engine setup
// app.engine('html', ejs.__express)
// app.set('view engine', 'html')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(COOKIE_SECRET))
app.use(
  express.static(path.join(__dirname, 'public'), {
    setHeaders: function(res, path, stat) {
      const { origin } = res.req.headers
      if (allowedOrigin.includes(origin)) {
        res.set('Access-Control-Allow-Origin', origin)
      }
    }
  })
)
app.use(function(req, res, next) {
  // 设置所有HTTP请求的超时时间
  // req.setTimeout(5000);
  // 设置所有HTTP请求的服务器响应超时时间
  res.setTimeout(REQUEST_TIMEOUT) //毫秒为单位，0为永不超时
  next()
})

app.all('*', function(req, res, next) {
  // if (!allowedOrigin.includes(req.headers.origin)) {
  //   return res.send(200)
  // }
  if (allowedOrigin.includes(req.headers.origin)) {
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Credentials', true)
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Content-Length, Authorization, Accept, X-Requested-With'
    )
    // res.header('Content-Type', 'application/json;charset=utf-8')
  }
  if (req.method == 'OPTIONS') {
    // return res.sendStatus(204).json({})
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    res.header('Access-Control-Max-Age', 60 * 60 * 24) //通过校验后，相对时间不满足不需要预检
    res.status(204)
    return res.json({})
  }
  const data = req.signedCookies[USER_COOKIE]
  if (!data && !req.url.includes('/api/users')) {
    res.send(
      responseData({
        code: 401,
        msg: '未登录'
      })
    )
  } else {
    next()
  }
})
app.use('/api', require('./routes'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
