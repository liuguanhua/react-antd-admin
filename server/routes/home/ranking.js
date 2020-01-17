const express = require('express')
const moment = require('moment')
const { Random, mock } = require('mockjs')

const {
  paginationAfterData,
  sortAndFilterDate,
  addFromNow,
  getFixedNumMonth,
  begetDateTime,
  createImage,
  responseData
} = require('../../scripts/utils')
const { GOOD_LIST, COMPANY_TYPE } = require('../../scripts/constant')

const router = express.Router()
const { capitalize, natural } = Random

/**
 * 生成销售榜单数据
 */
const randomGenerateInfo = (value, type) => {
  return [...Array(mock('@natural(0,60)')).keys()].map(i => {
    const info =
      {
        0: {
          goodsName: `${Random.now('yyyy')}新款${
            GOOD_LIST[natural(0, GOOD_LIST.length - 1)]
          }`
        },
        3: {
          type: `${COMPANY_TYPE[natural(0, COMPANY_TYPE.length - 1)]}企业`
        }
      }[type] || {}
    return mock({
      id: '@guid',
      ranking: `${capitalize('top')}${++i}`,
      ...value,
      ...info
    })
  })
}
const salesData = {
  0: randomGenerateInfo(
    {
      'price|10-200.2': 10,
      'quantity|100-1000': 100,
      sales: function() {
        return (this.price * this.quantity).toFixed(2)
      }
    },
    0
  ),
  1: randomGenerateInfo({
    clientName: `@cname`,
    'price|10-200.2': 10,
    'orderQuantity|100-1000': 100,
    sales: function() {
      return (this.price * this.orderQuantity).toFixed(2)
    }
  }),
  2: randomGenerateInfo({
    areaName: `@county(true)`,
    'price|10-200.2': 10,
    'orderQuantity|100-1000': 100,
    sales: function() {
      return (this.price * this.orderQuantity).toFixed(2)
    }
  }),
  3: randomGenerateInfo(
    {
      supplierName: '@city()@cword(2)有限公司',
      'price|10-200.2': 10,
      'salesVolume|100-1000': 100,
      sales: function() {
        return (this.price * this.salesVolume).toFixed(2)
      }
    },
    3
  ),
  4: randomGenerateInfo({
    salesManName: `@cname`,
    'price|10-200.2': 10,
    'orderQuantity|100-1000': 100,
    sales: function() {
      return (this.price * this.orderQuantity).toFixed(2)
    }
  })
}
/**
 * type 0=>产品销售 1=>客户购买 2=>地区购买 3=>供应商商品 4=>业务员
 */
router.get('/sales/:type', function(req, res) {
  const { type = 0 } = req.params
  const data = salesData[type]
  if (!data) {
    return res.send(
      responseData({
        code: 400,
        msg: '参数错误!'
      })
    )
  }
  paginationAfterData({ res, query: req.query, data }).then(values => {
    res.send(
      responseData({
        data: {
          ...values,
          type
        }
      })
    )
  })
})

/**
 * 生成评论数据
 */
router.get('/comment/list', function(req, res) {
  const commentData = mock({
    'info|5-10': [
      {
        author: '@cname',
        avatar: function() {
          return createImage()
        },
        content: '@cparagraph(2)',
        datetime: function() {
          return begetDateTime()
        }
      }
    ]
  }).info
  res.send(
    responseData({
      data: addFromNow(sortAndFilterDate(commentData))
    })
  )
})

/**
 * 生成热销产品排行数据
 */
const fixedDateList = getFixedNumMonth(6)
const begetProductAmount = () => {
  return fixedDateList.reduce((info, v) => {
    return {
      ...info,
      [v]: Random.float(70, 120, 2, 2)
    }
  }, {})
}
router.get('/hot/product', function(req, res) {
  const hotProductData = mock({
    'info|5': [
      {
        name: function() {
          return GOOD_LIST[natural(0, GOOD_LIST.length - 1)]
        }
      }
    ]
  }).info
  res.send(
    responseData({
      data: {
        info: hotProductData.map(r => ({
          ...r,
          ...begetProductAmount()
        })),
        dateList: fixedDateList
      }
    })
  )
})

/**
 * 生成用户交易记录数据
 */
const generatePactRecord = () => {
  const data = mock({
    'info|5-40': [
      {
        avatar: function() {
          return createImage()
        },
        userName: `@cname`,
        type: '@natural(0,4)',
        datetime: function() {
          return begetDateTime()
        }
        // device：1
      }
    ]
  }).info
  const sortDateList = sortAndFilterDate(data)
  return sortDateList.map(v => {
    const index = v.datetime.indexOf(' ')
    if (index > -1) {
      v.datetime = v.datetime.substr(index)
    }
    return {
      ...v,
      datetime: v.datetime
        .replace(' ', Random.now('A'))
        .replace('AM', '早上 ')
        .replace('PM', '下午 ')
    }
  })
}
const pactRecordData = generatePactRecord()
router.get('/pactRecord', function(req, res) {
  paginationAfterData({ res, query: req.query, data: pactRecordData }).then(
    data => {
      res.send(
        responseData({
          data
        })
      )
    }
  )
})

/**
 * 生成产品购买趋势数据
 */
const buyProductData = mock({
  'info|5-40': [
    {
      productImage: function() {
        return createImage()
      },
      productName: `@cword(5)`,
      quantity: '@natural(10000,100000)',
      trend: '@float(10, 30, 2,2)',
      isIncrease: '@boolean(2,5)',
      lastQuantity: '@natural(20, 300)'
    }
  ]
}).info
router.get('/buyProductList', function(req, res) {
  paginationAfterData({ res, query: req.query, data: buyProductData }).then(
    data => {
      res.send(
        responseData({
          data
        })
      )
    }
  )
})

/**
 * 生成销售报告数据
 */
const LIMIT_DAY = 3
const generateSalesReportData = () => {
  const salesReportData = mock({
    'info|60': [
      {
        totalMoney: '@natural(80000,100000)'
      }
    ]
  }).info
  const reportDataLength = salesReportData.length
  return salesReportData.map((v, i) => {
    return {
      ...v,
      time: moment()
        .subtract(reportDataLength - 1 - i, 'days')
        .format('YYYY-MM-DD')
    }
  })
}
const lastSalesReportData = generateSalesReportData()
router.get('/salesReport', function(req, res) {
  const [lastEye, lastSecond, lastOne] = lastSalesReportData.slice(-LIMIT_DAY)
  const limitLastSalesReportData = lastSalesReportData.slice(
    0,
    lastSalesReportData.length - LIMIT_DAY
  )
  res.send(
    responseData({
      data: {
        yesterDayMoney: lastSecond.totalMoney,
        todayMoney: lastOne.totalMoney,
        eyeMoney: lastEye.totalMoney,
        lastSalesReportData: limitLastSalesReportData
      }
    })
  )
})

module.exports = router
