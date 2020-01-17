declare const PUBLIC_URL: string

declare interface IKeyStringProps {
  [key: string]: any
}

declare type TSetKeyStringProps = IKeyStringProps[]

declare const TThemeFields: ['light', 'dark', 'purple', 'orange', 'pink']

declare type TThemeField = typeof TThemeFields[number]

declare interface Window {
  g_app: any
  g_history: IKeyStringProps
  g_config: {
    name: string
    enName: string
    logo: string
    apiRoot: string
    themes: any
    defaultTheme: TThemeField
    isProd: boolean
    publicPath: string
    loginAddress: string
  }
  Highcharts: any
}

declare type TStringGroup = string[]

declare type TLoadingConfigProps =
  | {
      isFullScreen?: boolean
      customLoading?: React.ReactNode
    }
  | boolean

declare interface IRouteItemProps<T> extends IKeyStringProps {
  component?: string | Function
  icon?: string
  title?: string
  navHide?: boolean
  routes?: T[]
  search?: string
  redirect?: string
  isCarryPath?: boolean
  authority?: string[]
  models?: string[]
  component_from?: string //组件的位置 default：views
  loadingConfig?: TLoadingConfigProps
}

declare interface IRouteItem extends IRouteItemProps<IRouteItem> {
  path: string
}

declare interface IRouteItemMinor extends IRouteItemProps<IRouteItemMinor> {
  path?: string
}

declare interface IUserInfoProps {
  authority?: string
  userId?: number
  userName?: string
}

declare interface IUserInfo {
  userInfo: IUserInfoProps
}

declare interface IConfigInfoProps extends IKeyStringProps {
  isFixedSider?: boolean
  isFixedHeader?: boolean
  showLineNumbers?: boolean
  codeTheme?: string
}

declare interface ISharedProps {
  collapsed?: boolean
  foldMenu?: boolean
  configInfo?: IConfigInfoProps
  userInfo: IUserInfoProps
}

declare interface IRequestType<U = string, DP = IKeyStringProps> {
  url: U
  data?: DP
  params?: DP & {
    pageSize?: number
    pageIndex?: number
  }
  method?: 'get' | 'post'
  customApi?: boolean
  showTips?: boolean
  success?: (result: any) => void
  error?: (result: any) => void
}

declare interface IUrlParamsType {
  apiKey: string
  route?: string
}
declare type TFetchUrlType = IUrlParamsType | string

declare type IRequestParames<DPO = IKeyStringProps, T = object> = (
  props: DPO
) => T

declare interface IBeforeFetchDataProps<DPO = {}>
  extends IRequestType<
    string | IRequestParames<DPO, TFetchUrlType>,
    object | IRequestParames<DPO>
  > {
  autoFetch?: boolean | IRequestParames<DPO, boolean>
  hijack?: boolean | IRequestParames<DPO, boolean>
  isPagination?: boolean
  isCustomUrl?: boolean
  defaultData?: any
}

declare interface IBeforeFetchOptionProps {
  pageIndex?: number
  params?: IKeyStringProps
  callback?: (v?: { success: boolean; result: any }) => void
}

declare interface IBeforeFetchEmitProps {
  fetchData: (opt?: IBeforeFetchOptionProps) => void
  // options: IBeforeFetchDataProps;
  serveData: any
}

declare interface IRouteProps {
  route: {
    routes: IRouteItem[]
  }
}

// declare interface Promise<T> {
//   /**
//    * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
//    * resolved value cannot be modified from the callback.
//    * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
//    * @returns A Promise for the completion of the callback.
//    */
//   finally(onfinally?: (() => void) | undefined | null): Promise<T>
// }
