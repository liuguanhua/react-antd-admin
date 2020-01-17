import request from '@scripts/common'
import api from '@scripts/common/api'
import { PAGE_SIZE } from '@scripts/constant'

const {
  countDiffTypeQuantity,
  countPerformance,
  countGoodssales,
  rankingSales,
  rankingCommentList,
  rankingHotProduct,
  rankingPactRecord,
  rankingBuyProductList,
  rankingSalesReport
} = api

//获取不同类型的总数
export const getMallCountQuantity = () => {
  return request({
    url: countDiffTypeQuantity
  })
}

//获取业绩分析
export const getPerformanceInfo = (type: number) => {
  return request({
    url: `${countPerformance}/${type}`
  })
}

//获取销售额占比
export const getGoodsSalesInfo = () => {
  return request({
    url: countGoodssales
  })
}

//获取销售榜单
export const getSalesRankingInfo = (type: string, pageIndex: number = 1) => {
  return request({
    url: `${rankingSales}/${type}`,
    params: {
      pageSize: PAGE_SIZE,
      pageIndex: pageIndex
    }
  })
}

//获取评论
export const getCommentList = () => {
  return request({
    url: rankingCommentList
  })
}

//获取热销产品排行
export const getHotProduct = () => {
  return request({
    url: rankingHotProduct
  })
}

const PRODUCT_PAGE_SIZE = 5
//获取用户交易记录
export const getPactRecord = (pageIndex: number = 1) => {
  return request({
    url: rankingPactRecord,
    params: {
      pageSize: PRODUCT_PAGE_SIZE,
      pageIndex: pageIndex
    }
  })
}

//获取产品购买记录
export const getBuyProductList = (pageIndex: number = 1) => {
  return request({
    url: rankingBuyProductList,
    params: {
      pageSize: PRODUCT_PAGE_SIZE,
      pageIndex: pageIndex
    }
  })
}

//获取产品购买记录
export const getRankingSalesReport = () => {
  return request({
    url: rankingSalesReport
  })
}
