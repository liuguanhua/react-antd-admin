import { createContext } from 'react'

import { DEFAULT_THEME } from '@root/src/scripts/constant'

export const CtxMenu = createContext<{
  routes: IRouteItem[]
}>({
  routes: []
})

export interface ICtxThemeProps {
  theme: TThemeField
  switchTheme: any
}

export const ThemeContext = createContext<ICtxThemeProps>({
  theme: DEFAULT_THEME,
  switchTheme: () => {}
})
/* const files = require.context('.', true, /\.tsx$/)
const contexts = files.keys().reduce((info, item) => {
  const strItem = item.replace('./', '').replace('.tsx', '')
  if (item !== './index.tsx') {
    info = {
      ...info,
      [strItem]: files(item).default //读取default模块
    }
  }
  return info
}, {})

export default contexts */
