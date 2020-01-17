const { defaultTheme } = window.g_config
const themeFields = ['light', 'dark', 'purple', 'orange', 'pink']

export const WEB_CONFIG = 'WEB_CONFIG'
export const USER_CONFIG = 'USER_CONFIG'
export const MONTH_FORMAT = 'YYYY/MM'
export const DATE_FORMAT = 'YYYY/MM/DD'
export const RANGE_DATE = 'RANGE_DATE'
export const SKELETON_DEFAULT_COLOR = '#E0E0E0'
export const DEFAULT_THEME = themeFields.includes(defaultTheme)
  ? defaultTheme
  : 'purple'
export const DARK_THEME = 'dark'
export const DEFAULT_CODE_THEME = 'xonokai'

export const PAGE_INDEX = 1
export const PAGE_SIZE = 10
export const FIXED_PAGE_SIZE = 10
export const MD_WIDTH_NUM = 769
export const SIDER_WIDTH = 170
export const COLLAPSED_SIDER_WIDTH = 80
export const BREADCRUMBS_HEIGHT = 40
export const MODAL_INIT_WIDTH = 800
export const SKELETON_CARD_TITLE_HEIGHT = 30
export const HOME_CARD_PADDING = 20

export const MARKDOWN_CODE_THEME = [
  'coy',
  'dark',
  'funky',
  'okaidia',
  'solarizedlight',
  'tomorrow',
  'twilight',
  'prism',
  'atomDark',
  'base16AteliersulphurpoolLight',
  'cb',
  'darcula',
  'duotoneDark',
  'duotoneEarth',
  'duotoneForest',
  'duotoneLight',
  'duotoneSea',
  'duotoneSpace',
  'ghcolors',
  'hopscotch',
  'pojoaque',
  'vs',
  'xonokai'
]

export const STYLE_TEXT_ROW = {
  margin: '26px auto 0',
  height: 40
}
export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  }
}
export const default_fetch_options: IRequestType = {
  method: 'get',
  url: '',
  customApi: false,
  data: {},
  params: {},
  showTips: true,
  success: () => {},
  error: () => {}
}
