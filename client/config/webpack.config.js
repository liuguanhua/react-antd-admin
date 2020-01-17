const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { selfTest, isProd, resolveApp } = require('./helpTool')

const isFinalProd = isProd && !selfTest

const webConfig = {
  mode: isProd ? 'production' : 'development',
  entry: {
    config: resolveApp('config')
  },
  output: {
    path: resolveApp(isFinalProd ? '.temp' : 'public'),
    filename: '[name].js',
    hotUpdateChunkFilename: '../.temp/hot/hot-update.js',
    hotUpdateMainFilename: '../.temp/hot/hot-update.json'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            compact: true
          }
        },
        exclude: [resolveApp('node_modules')]
      }
    ]
  },
  target: 'web',
  node: {
    fs: 'empty',
    child_process: 'empty',
    Buffer: false
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
}
if (isFinalProd) {
  webConfig.plugins.push(
    new CopyWebpackPlugin([
      {
        from: {
          glob: resolveApp('config/prod.config.js'),
          dot: true
        },
        to: resolveApp('public/config.js')
      },
      {
        from: {
          glob: resolveApp('now.json'),
          dot: true
        },
        to: resolveApp('public/now.json')
      }
    ])
  )
}

module.exports = webConfig
