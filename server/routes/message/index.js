const express = require('express')
const { mock, Random } = require('mockjs')
const router = express.Router()

const {
  begetDateTime,
  paginationAfterData,
  sortAndFilterDate,
  responseData
} = require('../../scripts/utils')

/**
 * 生成信息邮件数据
 */
const generateInboxData = () => {
  const data = mock({
    'info|10-60': [
      {
        id: '@guid',
        sender: '@cname',
        subject: '@cparagraph(2)',
        datetime: () => {
          return begetDateTime()
        },
        isStar: '@boolean(2,5)'
      }
    ]
  }).info
  const limitNum = Random.natural(2, 6)
  const sortData = sortAndFilterDate(data)
  const inboxData = sortData.map((item, index) => {
    return {
      ...item,
      isUnread: !(index > limitNum)
    }
  })
  const info = inboxData.reduce(
    (info, { isStar, isUnread }) => {
      if (isUnread) {
        info.totalUnreadNum += 1
      }
      if (isStar) {
        info.totalStarNum += 1
      }
      return info
    },
    {
      totalStarNum: 0,
      totalUnreadNum: 0
    }
  )
  return {
    inboxData,
    ...info
  }
}
const { inboxData, ...rest } = generateInboxData()
router.get('/inbox', function(req, res) {
  paginationAfterData({ query: req.query, data: inboxData }).then(data => {
    res.send(
      responseData({
        data: {
          ...data,
          ...rest
        }
      })
    )
  })
})

module.exports = router
