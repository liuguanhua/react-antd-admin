import { IwindowWH } from '@scripts/types'

export const MD_WIDTH_NUM = 769
/**
 * 获取窗体可视宽高
 * @returns {IwindowWH}
 */
export const getWindowWh = (): IwindowWH => {
  const docEle = document.documentElement as HTMLElement
  const width: number =
    window.innerWidth ||
    (docEle && docEle.clientWidth) ||
    document.body.clientWidth
  const height: number =
    window.innerHeight ||
    (docEle && docEle.clientHeight) ||
    document.body.clientHeight
  return { width, height }
}
export const isMobile = () => getWindowWh().width <= MD_WIDTH_NUM

export const MAIN_SCOPE_NUM = isMobile() ? 16 : 24

export const setRouterLoadingConfig = (
  router: IRouteItemMinor[],
  loadingConfig: TLoadingConfigProps = true
) => router.map(route => ({ ...route, loadingConfig }))
