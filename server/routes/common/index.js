const express = require('express')
const { mock } = require('mockjs')
const router = express.Router()
const {
  begetDateTime,
  paginationAfterData,
  sortAndFilterDate,
  addFromNow,
  createImage,
  responseData
} = require('../../scripts/utils')

/**
 * 生成列表数据
 */
const generateListData = () => {
  const data = mock({
    'info|20-80': [
      {
        id: '@id',
        title: '@ctitle',
        pic: function() {
          return createImage({ width: 400, height: 400 })
        },
        content: '@cparagraph(2)',
        datetime: function() {
          return begetDateTime()
        }
      }
    ]
  }).info
  return addFromNow(sortAndFilterDate(data))
}

const data = generateListData()
router.get('/list', function({ query }, res) {
  paginationAfterData({ res, query, data }).then(info => {
    res.send(
      responseData({
        data: info
      })
    )
  })
})

module.exports = router
