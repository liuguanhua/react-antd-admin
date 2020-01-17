window.g_config = (function() {
  var drakColor = '#001529'
  var publicPath = '/'
  // var publicPath = 'http://localhost:5000/build/'
  // var publicPath = 'https://react-antd-admin.lhh.now.sh/'
  // var publicPath = 'https://liuguanhua.github.io/react-antd-admin/'
  var themes = {
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
    logo: ''.concat(publicPath, 'static/logo.svg'),
    apiRoot: 'http://localhost:9999/',
    // apiRoot: 'https://api.lhh.now.sh/',
    themes: themes,
    defaultTheme: 'purple',
    isProd: true,
    publicPath: publicPath,
    loginAddress: ''.concat(publicPath, '#/user/login')
  }
})()
