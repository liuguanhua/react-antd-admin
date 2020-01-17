const express = require('express')
const { mock } = require('mockjs')
const router = express.Router()

const { responseData } = require('../../scripts/utils')

/**
 * 生成不同类型总量统计数据
 */
const data1 = mock({
  'info|4': [
    {
      num: '@natural(46000,90000)',
      'name|+1': ['商品总数', '销售总数', '用户总数', '访问量']
    }
  ]
}).info
router.get('/diffTypeQuantity', function(_, res) {
  res.send(
    responseData({
      data: data1
    })
  )
})

/**
 * 生成业绩分析数据
 */
const generatePerformanceData = () => {
  return [...Array(12).keys()].map(i =>
    mock({
      month: `${++i}月`,
      amount: '@natural(10,100)',
      'profit|1-10': 10
    })
  )
}
/**
 * type 0=>月 1=>年
 */
router.get('/performance/:type', function(req, res) {
  const { type = 0 } = req.params
  if (![0, 1].includes(+type)) {
    return res.send(
      responseData({
        code: 400,
        msg: '参数错误!'
      })
    )
  }
  res.send(
    responseData({
      data: generatePerformanceData()
    })
  )
})

/**
 * 生成销售额占比数据
 */
const data3 = mock({
  'info|5': [
    {
      'name|+1': ['进口商品', '美容洗护', '家具家电', '食品饮料', '其它'],
      value: '@natural(100,10000)'
    }
  ]
}).info
router.get('/goodssales', function(_, res) {
  res.send(
    responseData({
      data: data3
    })
  )
})

module.exports = router
