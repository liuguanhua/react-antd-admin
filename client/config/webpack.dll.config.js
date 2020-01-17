const webpack = require('webpack')
const { isProd, resolveApp } = require('./helpTool')
const { paths } = require('react-app-rewired')

module.exports = {
  mode: isProd ? 'production' : 'development',
  entry: {
    vendors: ['react', 'react-router-dom', 'axios'],
    antd: ['antd']
  },
  output: {
    path: paths.appPublic,
    filename: 'static/js/[name].js',
    library: '[name]_[hash]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: resolveApp('.temp/manifest/[name]-manifest.json'),
      name: '[name]_[hash]',
      context: __dirname
    })
  ]
}
