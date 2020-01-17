const webpack = require('webpack')
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const { paths } = require('react-app-rewired')
const {
  override,
  fixBabelImports,
  useEslintRc,
  addLessLoader,
  addWebpackAlias,
  useBabelRc
} = require('customize-cra')

const { isProd, g_config, resolveApp } = require('./config/helpTool')
const { themes, publicPath, enName } = g_config
const appConfig = resolveApp('config')
const appRoot = resolveApp('')

const customConfig = () => config => {
  config.output.publicPath = publicPath
  config.externals = {
    '@antv/data-set': 'DataSet'
  }
  config.plugins.splice(
    0,
    1,
    new HtmlWebpackPlugin({
      title: enName,
      filename: 'index.html',
      inject: true,
      template: paths.appHtml,
      ...(isProd && {
        hashValue: Math.random()
          .toString(36)
          .substr(2),
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        }
      })
    }),
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
      NODE_ENV: process.env.NODE_ENV || 'development',
      PUBLIC_URL: publicPath
    })
    // new webpack.DllReferencePlugin({
    //   context: __dirname,
    //   manifest: require(resolveApp(
    //     'public/static/manifest/vendors-manifest.json'
    //   ))
    // }),
    // new webpack.DllReferencePlugin({
    //   context: __dirname,
    //   manifest: require(resolveApp('public/static/manifest/antd-manifest.json'))
    // })
  )
  config.resolve.plugins.splice(
    1,
    1,
    new ModuleScopePlugin(appRoot, [appConfig, paths.appPackageJson])
  )
  if (isProd) {
    // config.devtool = false
  } else {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerPort: 5555
      })
    )
  }
  //ref:https://github.com/ant-design/ant-design/issues/12011
  const alias = config.resolve.alias || {}
  alias['@ant-design/icons/lib/dist$'] = resolveApp('src/scripts/icons.ts')
  config.resolve.alias = alias

  return config
}

module.exports = {
  webpack: override(
    useBabelRc(),
    useEslintRc('./.eslintrc.json'),
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true
    }),
    addLessLoader({
      javascriptEnabled: true,
      modifyVars: themes.skin
    }),
    addWebpackAlias({
      '@root': resolveApp(''),
      '@': resolveApp('src'),
      '@module': resolveApp('node_modules'),
      '@assets': resolveApp('src/assets'),
      '@images': resolveApp('src/assets/images'),
      '@styles': resolveApp('src/assets/styles'),
      '@fonts': resolveApp('src/assets/fonts'),
      '@components': resolveApp('src/components'),
      '@scripts': resolveApp('src/scripts'),
      '@views': resolveApp('src/views'),
      '@store': resolveApp('src/store')
    }),
    customConfig()
  )
}
