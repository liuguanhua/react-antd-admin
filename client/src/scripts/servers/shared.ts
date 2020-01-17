import request from '../common'
import api from '../common/api'
import { FIXED_PAGE_SIZE } from '../constant'

const { getInfiniteList } = api

// 获取列表
export const fetchInfiniteListData = (pageIndex: number) => {
  return request({
    url: getInfiniteList,
    params: {
      pageIndex,
      pageSize: FIXED_PAGE_SIZE
    }
  })
}
