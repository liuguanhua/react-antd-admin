const moment = require('moment')

const IDENTITY_KEY = 'authToken'
const USER_SESSION = 'USER_SESSION'
const USER_COOKIE = 'USER_TOKEN'
const COOKIE_SECRET = 'COOKIE_SECRET'
const MAX_MONTH = 12
const DEFAULT_PAGE_SIZE = 10
const TEMP_USER_LENGTH = 250
const CURRENT_YEAR = +moment().format('YYYY')
const CURRENT_MONTH = +moment().format('M')
const PASSWORD = '888888'
const REQUEST_TIMEOUT = 20000

const GOOD_LIST = [
  '巧克力',
  '油',
  '牙膏',
  '纸',
  '奶粉',
  '玻璃杯',
  '拖鞋',
  '洗面奶',
  'vivo',
  'apple',
  '小米',
  '酒水'
]
const COMPANY_TYPE = [
  '合资',
  '独资',
  '国有',
  '私营',
  '全民所有制',
  '集体所有制',
  '股份制'
]

module.exports = {
  IDENTITY_KEY,
  USER_SESSION,
  USER_COOKIE,
  COOKIE_SECRET,
  GOOD_LIST,
  COMPANY_TYPE,
  PASSWORD,
  REQUEST_TIMEOUT,
  MAX_MONTH,
  DEFAULT_PAGE_SIZE,
  CURRENT_YEAR,
  CURRENT_MONTH,
  TEMP_USER_LENGTH
}
