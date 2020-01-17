import * as React from 'react'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { ConfigProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'

moment.locale('zh-cn')

export default function injectLocaleLang<P extends object>(
  WrapComponent: React.ComponentType<P>
): React.ComponentClass<P> {
  //必须是class组件
  return class LocaleLangCompt extends React.Component<P> {
    render() {
      return (
        <ConfigProvider locale={zh_CN}>
          <WrapComponent {...this.props} />
        </ConfigProvider>
      )
    }
  }
}
