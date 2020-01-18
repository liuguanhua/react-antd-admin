import Rstore from 'store'
import qs from 'qs'
import moment, { Moment } from 'moment'
import { isObject, isArray, isString } from 'util'

import { TColumnType, INoticeNumProps } from '@scripts/types'
import { EUserSex } from './types/EnumType'

import {
  WEB_CONFIG,
  RANGE_DATE,
  DEFAULT_CODE_THEME,
  DATE_FORMAT
} from '@scripts/constant'
import routers from '@scripts/routers'
import equalPaths from './equalPaths'

const engine = require('store/src/store-engine')
const storages = [require('store/storages/sessionStorage')]
const { loginAddress } = window.g_config

/**
 * 判断类型
 * @param {*} [value]
 * @returns
 */
export const verifyType = (value?: any) => {
  return function(str?: string): boolean {
    return Object.is(Object.prototype.toString.call(value), `[object ${str}]`)
  }
}
export const isFunction = (value?: any): value is Function =>
  Object.is(typeof value, 'function')
export const isValidArray = (data?: any): boolean =>
  isArray(data) && Boolean(data.length)

/**
 * 随机范围类生成值
 * @param {number} [n=10]
 * @param {number} [m=100]
 * @returns
 */
export const randomRange = (n: number = 10, m: number = 100) => {
  const c = m - n + 1
  return Math.floor(Math.random() * c + n)
}
/**
 * 存取本地值
 * @template T
 * @param {string} key
 * @param {T} value
 * @param {boolean} [isReplace=false]
 */
export const setStorage = <T>(
  key: string,
  value: T,
  isReplace: boolean = false
) => {
  if (isObject(value)) {
    value['keyTime'] = +new Date()
    if (!isReplace) {
      const saveData = getStorage(key)
      value = {
        ...saveData,
        ...value
      }
    }
  }
  Rstore.set(key, value)
}
export const getStorage = (key: string): IKeyStringProps | undefined =>
  Rstore.get(key)
export const sessionStore = engine.createStore(storages)

/**
 * 简单版本深拷贝
 * @template T
 * @param {T} data
 * @returns {T}
 */
export const deepCopy = <T>(data: T): T => JSON.parse(JSON.stringify(data))

/**
 *  拆分URL路径为列表
 * @param {string} pathname
 * @returns {string[]}
 */
export const splitPathList = (pathname: string = ''): string[] => {
  const filterPathList = pathname.split('/').filter(item => item)
  return filterPathList.map(
    (_, key) => `/${filterPathList.slice(0, key + 1).join('/')}`
  )
}

/**
 * 获取全部路由信息
 * @param {IRouteItemMinor[]} routersList
 * @param {boolean} [isFilterRepeat=true]
 * @returns {IRouteItem[]}
 */
export const getAllRouteList = (
  routersList: IRouteItemMinor[],
  isFilterRepeat: boolean = true
): IRouteItem[] => {
  const loopFindPath = (
    routeList: IRouteItemMinor[],
    value: IRouteItem[] = []
  ) => {
    return routeList
      .filter(item => item.path)
      .reduce((info, item) => {
        const { path, routes } = item
        if (routes) {
          if (isFilterRepeat && !routes.some(v => Object.is(v.path, path))) {
            info = [...info, item as IRouteItem]
          }
          return loopFindPath(routes, info)
        }
        return [...info, item as IRouteItem]
      }, value)
  }
  return loopFindPath(routersList)
}

/**
 * 转换moment日期
 * @template T
 * @param {(T | Moment)} value
 * @returns
 */
const formatTime = <T>(value: T | Moment, format: string = DATE_FORMAT) => {
  if (value instanceof moment) {
    return (value as Moment).format(format)
  }
  return value
}
export const formatDateData = (values: IKeyStringProps, format?: string) => {
  for (const [k, v] of Object.entries(values)) {
    values[k] = formatTime(v, format)
  }
  return values
}

export const hasDirectKey = (data: IKeyStringProps, key: string = '') =>
  Object.hasOwnProperty.call(data, key)

export const isEveryHaveKey = <T>(data: T[], key: string) =>
  data.every(item => hasDirectKey(item, key))
/**
 * 给数组添加字段key或者align
 * @param {TSetKeyStringProps} data
 * @param {boolean} [isCenter=false]
 * @returns
 */
interface IUseFieldProps {
  align?: string
  key?: string | number
  id?: string | number
}
export const addUseField = <T extends IUseFieldProps>(
  option: {
    data?: T[]
    isCenter?: boolean
    fieldName?: string
  } = {}
): T[] => {
  const { data, isCenter = false, fieldName = '' } = option
  if (!isArray(data)) {
    console.warn('参数不合法!')
    return []
  }
  const isEveryFieldKey = isEveryHaveKey(data, 'key')
  if (isCenter) {
    const isEveryFieldAlign = isEveryHaveKey(data, 'align')
    if (isEveryFieldAlign) return data
  } else if (isEveryFieldKey) {
    return data
  }
  return data.map((item, key) => {
    return {
      ...item,
      key: item.key || item[fieldName] || key,
      ...(isCenter &&
        !item.align && {
          align: 'center'
        })
    }
  })
}
export const begetColunmKey = (data: TColumnType): TColumnType => {
  return addUseField({
    data,
    fieldName: 'dataIndex',
    isCenter: true
  })
}

/**
 * 跳转登录页
 * @param {string} [pathname]
 */
export const goJumpLoginPage = () => {
  if (!equalPaths.isLogin) {
    const time = 1000
    console.log('正在跳转...')
    setTimeout(() => {
      window.location.href = loginAddress
    }, time)
  }
}

const allRouteInfo = getAllRouteList(routers)
/**
 * 根据路径查找路由信息
 * @param {string} [pathname]
 * @returns {IRouteItemMinor}
 */
const findItemRoute = (
  pathname?: string,
  routeList?: IRouteItemMinor[]
): IRouteItemMinor =>
  (isArray(routeList) ? getAllRouteList(routeList) : allRouteInfo).find(item =>
    Object.is(pathname, item.path)
  ) || {}

/**
 * 鉴权路由页面
 * @param {(string | IKeyStringProps)} [values={}]
 * @param {IKeyStringProps} [{ authority: currentUser }={}]
 * @returns {boolean}
 */
export const authRoutePage = (
  values: string | IKeyStringProps = {},
  { authority: currentUser }: IKeyStringProps = {}
): boolean => {
  const { authority } = isString(values) ? findItemRoute(values) : values
  return isArray(authority) ? authority.includes(currentUser) : true
}

/**
 * 获取URL参数
 * @template T
 * @param {T} [key]
 * @returns {(string | IKeyStringProps)}
 */
export const getSearchValues = <T>(
  key?: T
): T extends string ? string : IKeyStringProps => {
  const {
    location: { search }
  } = window.g_history
  const values = qs.parse(search.slice(1))
  return isString(key) ? values[key] || '' : values
}

/**
 * 设置URL携带内容
 * @param {{key?: string mark?: string}} [option={}]
 * @returns {string}
 */
export const setCarryContent = (
  option: {
    key?: string
    mark?: string
  } = {}
): string => {
  const { key = '', mark = '&' } = option
  let values: IKeyStringProps = {}
  const searchInfo = getSearchValues(key)
  values = isString(searchInfo)
    ? {
        [key]: searchInfo
      }
    : (searchInfo as IKeyStringProps)
  return Object.keys(values).length ? `${mark}${qs.stringify(values)}` : ''
}

/**
 * 查找数组中某个对应的值
 * @template T
 * @template K
 * @param {T[]} [data=[]]
 * @param {K} [value]
 * @param {string} [key='id']
 * @returns {IKeyStringProps}
 */
export const findItem = <T = {}, K = string>(
  data: T[] = [],
  value?: K,
  key: string = 'id'
): IKeyStringProps =>
  data.find(v =>
    isObject(v) ? Object.is(v[key], value) : Object.is(v, value)
  ) || {}

/**
 * 根据值查找对应的下标
 * @template T
 * @template K
 * @param {T[]} [data=[]]
 * @param {K} [value]
 * @param {string} [key='id']
 */
export const findItemIndex = <T = {}, K = string>(
  data: T[] = [],
  value?: K,
  key: string = 'id'
) =>
  data.findIndex(v =>
    isString(v) ? Object.is(v, value) : Object.is(v[key], value)
  )

/**
 * 转换数值
 * @param {number} num
 */
export const numToThousands = (num: number) =>
  isNaN(+num) ? '' : num.toLocaleString()

/**
 * 统计邮件信息消息数量
 * @param {TSetKeyStringProps} data
 * @returns {INoticeNumProps}
 */
export const countNoticeNum = (
  data: TSetKeyStringProps,
  noticeData?: INoticeNumProps
): INoticeNumProps => {
  const { lastTotalStarNum = 0, lastTotalUnreadNum = 0 } = noticeData || {}
  const { _totalStarNum, _totalUnreadNum } = data.reduce(
    (info, { isStar, isUnread }) => {
      if (isUnread) {
        info._totalUnreadNum += 1
      }
      if (isStar) {
        info._totalStarNum += 1
      }
      return info
    },
    {
      _totalStarNum: 0,
      _totalUnreadNum: 0
    }
  )
  const totalStarNum = _totalStarNum + lastTotalStarNum
  const totalUnreadNum = _totalUnreadNum + lastTotalUnreadNum
  const totalNoticeNum = totalStarNum + totalUnreadNum
  return {
    totalNoticeNum,
    totalStarNum,
    totalUnreadNum,
    lastTotalStarNum,
    lastTotalUnreadNum
  }
}

/**
 * 生成一定长度的数组
 * @param {number} [num=0]
 */
export const generateNumList = (num: number = 0) => [...Array(num).keys()]

/**
 * 去掉引号
 * @param {string} [str='']
 */
export const replaceDoubleQuotes = (str: string = '') => str.replace(/"/g, '')

export const configInfo: IConfigInfoProps = {
  isFixedHeader: true,
  isFixedSider: true,
  showLineNumbers: true,
  codeTheme: DEFAULT_CODE_THEME,
  ...getStorage(WEB_CONFIG)
}

/**
 * 过滤数据
 * @template T
 * @template K
 * @returns
 */
export const filterItem = <T = {}, K = string>(option: {
  data?: T[]
  value?: K
  key?: string
}) => {
  const { data = [], value = '', key = 'key' } = option
  return data.filter(v => {
    const newValue = isArray(value) ? value : [value]
    return !newValue.includes(isObject(v) ? v[key] : v)
  })
}

/**
 *
 * 转换form表单的数据
 * @param {IKeyStringProps} values
 * @returns
 */
export const changeFieldsValue = (values: IKeyStringProps) => {
  values = formatDateData(values)
  const doneTimeValue = values[RANGE_DATE]
  const flag =
    hasDirectKey(values, RANGE_DATE) &&
    isArray(doneTimeValue) &&
    doneTimeValue.length > 1
  if (!flag) return values
  delete values[RANGE_DATE]
  values = {
    ...values,
    ...(flag && {
      startTime: formatTime(doneTimeValue[0]),
      endTime: formatTime(doneTimeValue[1])
    })
  }
  return values
}
/**
 *
 * 赋值到对应的地市层级
 * @param {TSetKeyStringProps} parentData
 * @param {TSetKeyStringProps} childData
 * @param {string} [key='cityCode']
 * @returns
 */
export const assignAreaData = (
  parentData: TSetKeyStringProps,
  childData: TSetKeyStringProps,
  key: string = 'cityCode'
) => {
  return parentData.map(item => {
    item.items = childData.filter(v => Object.is(v[key], item.code))
    return item
  })
}

export const removeSpace = (str: string) => str.replace(/\s+/g, '')

export const generateProvideOption = (data: IKeyStringProps) =>
  Object.keys(data)
    .filter(v => isNaN(+v))
    .map(label => ({
      label,
      value: data[label]
    }))

export const userSexOption = generateProvideOption(EUserSex)

export const toLowerCaseString = (str: any = '') =>
  isString(str) ? str.toLowerCase() : str

export const toHorizontalLine = (str: any = '') =>
  isString(str) ? str.replace(/([A-Z])/g, '-$1').toLowerCase() : str

export const clearLoginInfo = () => {
  Rstore.clearAll()
  goJumpLoginPage()
}
