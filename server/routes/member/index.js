const express = require('express')
const { mock, Random } = require('mockjs')
const router = express.Router()
const { isArray } = require('util')
const moment = require('moment')
const {
  begetDateTime,
  paginationAfterData,
  sortAndFilterDate,
  createImage,
  responseData,
  findItemIndex
} = require('../../scripts/utils')

/**
 * 生成会员列表数据
 */
const generateMemberData = (query = {}) => {
  const data = mock({
    'info|10-60': [
      {
        userId: '@guid',
        name: '@cname',
        nickname: function() {
          return Random.name()
        },
        email: '@email',
        address: '@county(true)',
        sex: () => {
          return Random.boolean() ? 1 : 0
        },
        'grade|1-100': 1,
        // registerTime: () => {
        //   return begetDateTime()
        // },
        registerTime: '@datetime',
        avatar: function() {
          return createImage()
        }
      }
    ]
  }).info
  const sortData = sortAndFilterDate(data, 'registerTime')
  return sortData
}
let memberData = generateMemberData()

const timeLimitData = ({ startTime, endTime }, refTime) => {
  if (startTime && endTime) {
    const isEqual = Object.is(startTime, endTime)
    const turnRegisterTime = moment(refTime)
    if (
      isEqual
        ? turnRegisterTime.isBefore(startTime)
        : !(
            turnRegisterTime.isBefore(endTime) &&
            turnRegisterTime.isAfter(startTime)
          )
    ) {
      return false
    }
  }
  return true
}

const filterMemberData = (query = {}, data = []) => {
  const { startTime, endTime, name: qName = '', address: qAddress } = query
  const flag = isArray(qAddress)
  const strAddress = flag
    ? qAddress.filter(v => !Object.is(v, '市辖区')).join(' ')
    : ''
  return data.filter(item => {
    const { name, address, registerTime } = item
    if (!name.includes(qName) || (flag && !address.includes(strAddress)))
      return false
    return timeLimitData(query, registerTime)
  })
}

router.get('/list', function({ query }, res) {
  let data = filterMemberData(query, memberData)
  paginationAfterData({ res, query, data }).then(info => {
    res.send(
      responseData({
        data: {
          ...info
        }
      })
    )
  })
})

/**
 * 添加会员
 */
router.post('/add', function(req, res) {
  let data = {}
  const { address } = req.body
  const success = Random.boolean()
  if (success) {
    data = {
      ...req.body,
      userId: Random.guid(),
      address: address.join(' '),
      avatar: createImage(),
      registerTime: Random.now()
    }
  }
  data.userId && memberData.unshift(data)
  res.send(
    responseData({
      data,
      success
    })
  )
})

/**
 * 更新会员
 */
router.post('/update/:userId', function(req, res) {
  const { userId } = req.params
  const index = findItemIndex(memberData, userId, 'userId')
  if (index > -1) {
    const { address } = req.body
    memberData[index] = {
      ...memberData[index],
      ...req.body,
      address: address.join(' ')
    }
    return res.send(
      responseData({
        data: memberData[index]
      })
    )
  }
  res.send(
    responseData({
      success: false
    })
  )
})

/**
 * 删除会员
 */
router.post('/delete/:userId', function(req, res) {
  const { userId } = req.params
  const index = findItemIndex(memberData, userId, 'userId')
  if (index > -1) {
    memberData = memberData.filter(item => !Object.is(item.userId, userId))
    return res.send(responseData())
  }
  res.send(
    responseData({
      success: false
    })
  )
})

module.exports = router
