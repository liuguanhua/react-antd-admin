;(function(self, factory) {
  self.g_config = factory()
})(global || window || {}, function() {
  const drakColor = '#001529'
  const isProd = process.env.NODE_ENV === 'production'
  const visitPath = '/'
  // const visitPath = 'http://localhost:5000/build/'
  // const visitPath = 'https://react-antd-admin.lhh.now.sh/'
  // const visitPath = 'https://liuguanhua.github.io/react-antd-admin/'
  const publicPath = isProd ? visitPath : '/'
  const themes = {
    color: '#1890ff',
    skin: {
      '@primary-color': '#1890ff',
      '@layout-header-background': '#fff',
      '@layout-sider-background': drakColor,
      '@menu-dark-bg': drakColor
    }
  }
  return {
    name: '管理系统',
    enName: 'react-antd-admin',
    logo: publicPath + 'static/logo.svg',
    apiRoot: 'http://localhost:9999/',
    // apiRoot: 'http://apidemo.lhh.now.sh:9999/',
    // apiRoot: 'https://api.lhh.now.sh/',
    themes,
    defaultTheme: 'purple',
    isProd,
    publicPath,
    loginAddress: `${isProd ? '#' : ''}/user/login`
  }
})
