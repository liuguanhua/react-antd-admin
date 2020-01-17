const { Random } = require('mockjs')
const express = require('express')
const router = express.Router()

const { responseData } = require('../../scripts/utils')

/**
 * 生成用户区域分布数据
 */
const data = [
  {
    name: '美国',
    code3: 'USA',
    code: 'US'
  },
  {
    name: '中国',
    code3: 'CHN',
    code: 'CN'
  },
  {
    name: '日本',
    code3: 'JPN',
    code: 'JP'
  },
  {
    name: '德国',
    code3: 'DEU',
    code: 'DE'
  },
  {
    name: '印度',
    code3: 'IND',
    z: 1324171,
    code: 'IN'
  },
  {
    name: '法国',
    code3: 'FRA',
    code: 'FR'
  },
  {
    name: '英国',
    code3: 'GBR',
    code: 'GB'
  },
  {
    name: '巴西',
    code3: 'BRA',
    code: 'BR'
  },
  {
    name: '意大利',
    code3: 'ITA',
    code: 'IT'
  },
  {
    name: '加拿大',
    code3: 'CAN',
    code: 'CA'
  }
].map(v => {
  v.z = Random.natural(1e4, 1e5)
  return v
})
router.get('/world', function(_, res) {
  res.send(
    responseData({
      data
    })
  )
})

module.exports = router
