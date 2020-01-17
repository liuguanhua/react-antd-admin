const fs = require('fs')
const path = require('path')
const isProd = process.env.NODE_ENV === 'production'
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

require('./index')

module.exports = {
  selfTest: false, //如果为true，build时会将config文件下的index.js编译输出，反之会将prod.config.js输出
  isProd,
  g_config: global.g_config, //node 环境
  resolveApp
}
