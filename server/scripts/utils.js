const moment = require('moment')
const { Random } = require('mockjs')
const {
  MAX_MONTH,
  CURRENT_MONTH,
  CURRENT_YEAR,
  DEFAULT_PAGE_SIZE
} = require('./constant')
const { isArray, isObject, isNumber } = require('util')

const isVaildAddress = (address = []) => {
  const PCC_LENGTH = 3 //省、市、显
  return isArray(address) && Object.is(address.length, PCC_LENGTH - 1)
}

/**
 * 设置千分位标识符
 * Random.boolean() ? 1 : 0,
 * @param {*} num
 * @returns
 */
const numToThousands = num => {
  // num.toLocaleString()
  // num.toString().replace(/\B(?=(?:\d{3})+\b)/g, ',');
  return num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
}

const randomRange = (n = 10, m = 100) => {
  const c = m - n + 1
  return Math.floor(Math.random() * c + n)
}

const checkDate = i => `${i > 9 ? i : `0${i}`}`

const outYearMonthList = (
  length = MAX_MONTH,
  limit = MAX_MONTH,
  year = CURRENT_YEAR
) =>
  [...Array(length).keys()]
    .slice(-limit)
    .map(v => `${year}/${checkDate(+v + 1)}`)
/**
 * 获取到limit月份length个值
 * @param {*} [length=MAX_MONTH]
 * @param {*} [limit=CURRENT_MONTH]
 * @returns
 */
const getFixedNumMonth = (length = MAX_MONTH, limit = CURRENT_MONTH) => {
  if (limit <= 0 || length <= 0) return []
  let data = []
  if (limit < length) {
    data = data.concat(
      outYearMonthList(MAX_MONTH, length - limit, CURRENT_YEAR - 1)
    )
  }
  return data.concat(outYearMonthList(limit, length, CURRENT_YEAR))
}

/**
 *
 * 日期排序，去除大于当前日期
 * @param {*} data
 * @returns
 */
const sortAndFilterDate = (data, sortKey = 'datetime') => {
  data = data.filter(v => moment(v[sortKey]).isBefore(moment()))
  let len = data.length - 1
  if (!len) return data
  data = data.sort((a, b) => {
    const c = a[sortKey],
      d = b[sortKey]
    if (moment(c).isBefore(d)) {
      return 1
    }
    if (moment(c).isAfter(d)) {
      return -1
    }
    return 0
  })
  //冒泡排
  // while (len > 0) {
  //   for (let j = 0; j < len; j++) {
  //     if (+new Date(data[j][sortKey]) < +new Date(data[j + 1][sortKey])) {
  //       ;[data[j + 1], data[j]] = [data[j], data[j + 1]]
  //     }
  //   }
  //   len--
  // }
  // for (let i = 0; i < len; i++) {
  //   for (let j = 0; j < len - 1 - i; j++) {
  //     if (+new Date(data[j].datetime) < +new Date(data[j + 1].datetime)) {
  //       ;[data[j + 1], data[j]] = [data[j], data[j + 1]]
  //     }
  //   }
  // }
  return data
}

/**
 * 对数据进行分页
 * @param {*} [query={}]
 * @param {*} [data=[]]
 * @returns
 */
const PARAMS_ERROR = '参数错误'
const toDataGoPagination = function({ query = {}, data = [] } = {}) {
  const { pageIndex: pIndex = 1, pageSize: pSize = DEFAULT_PAGE_SIZE } = query
  const pageIndex = Math.floor(pIndex)
  const pageSize = Math.floor(pSize)
  const totalCount = data.length
  data = isArray(data) ? data : []
  try {
    if (isNaN(pageIndex) || isNaN(pageSize)) {
      throw new Error(PARAMS_ERROR)
    }
  } catch (error) {
    return {
      data: [],
      totalCount,
      pageTotal: 0,
      pageSize: DEFAULT_PAGE_SIZE,
      pageIndex: 1,
      hasPrevPage: false,
      hasNextPage: false,
      error
    }
  }
  let limitData = []
  const totalPage = Math.ceil(totalCount / pageSize)
  const hasNextPage = pageIndex < totalPage
  if (hasNextPage || Object.is(pageIndex, totalPage)) {
    const sliceIndex = (pageIndex - 1) * pageSize
    limitData = data.slice(sliceIndex, pageSize * pageIndex)
  }
  const hasLength = Boolean(totalCount)
  return {
    data: limitData,
    totalCount,
    pageTotal: totalPage,
    pageSize: pageSize,
    pageIndex: pageIndex,
    hasPrevPage: hasLength && pageIndex > 1,
    hasNextPage: hasLength && hasNextPage
  }
}

const paginationAfterData = ({ res, ...rest }) => {
  return new Promise((resolve, reject) => {
    const info = toDataGoPagination(rest)
    if (!info.error) {
      return resolve(info)
    }
    if (res && res.send) {
      res.send(
        responseData({
          code: 403,
          msg: PARAMS_ERROR
        })
      )
    }
    return reject(403)
  })
}

/**
 * 添加相对时间
 * @param {*} data
 * @returns
 */
const addFromNow = data => {
  return data.map(v => {
    v.formNow = moment(v.datetime)
      .startOf('second')
      .fromNow()
    return v
  })
}
/**
 * 生成最近时间
 * @returns
 */
const begetDateTime = () => {
  const minute = Random.natural(0, Random.now('mm'))
  return (
    Random.now('yyyy-MM-dd ') +
    Random.now('HH:') +
    checkDate(minute) +
    Random.date(':ss')
  )
}

const createImage = (option = {}) => {
  const { width = 100, height = 200, bgColor = Random.color() } = option
  return Random.image(`${width}x${height}`, bgColor, '#fff', Random.word(1))
}

const responseData = (option = {}) => {
  const { code = 200, msg, data = {}, success: optSuccess } = option
  const success = Reflect.has(option, 'success')
    ? optSuccess
    : Object.is(code, 200)
  return {
    code,
    msg: msg || (success ? '成功' : '失败'),
    result: data,
    success
  }
}

const findItemIndex = (data = [], value, key = 'id') =>
  data.findIndex(v => Object.is(isObject(v) ? v[key] : v, value))

module.exports = {
  isVaildAddress,
  numToThousands,
  randomRange,
  checkDate,
  getFixedNumMonth,
  sortAndFilterDate,
  toDataGoPagination,
  paginationAfterData,
  addFromNow,
  begetDateTime,
  createImage,
  responseData,
  findItemIndex
}
