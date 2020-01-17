import { isNumber } from 'util'
import { message } from 'antd'

import { findItemIndex, countNoticeNum } from '@scripts/utils'

const getDirect = (payload: IKeyStringProps) => {
  const { direct } = payload
  return +direct
}

export default {
  namespace: 'inbox',
  state: {
    dataSource: [],
    noticeData: {
      totalNoticeNum: 0,
      totalUnreadNum: 0,
      lastTotalUnreadNum: 0,
      totalStarNum: 0,
      lastTotalStarNum: 0
    }
  },
  reducers: {
    upState(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    }
  },
  effects: {
    *selectInboxItem({ payload }, { select, put }) {
      //direct与EOperateInboxDirect枚举相对应
      const _direct = getDirect(payload)
      if (!isNumber(_direct)) return
      const { dataSource: oldDataSource } = yield select(({ inbox }) => inbox)
      let dataSource = oldDataSource
      switch (true) {
        case _direct < 2:
          dataSource = oldDataSource.map(item => ({
            ...item,
            checked: !_direct
          }))
          break
        case _direct < 6:
          const isSwitchUnread = [2, 3].includes(_direct)
          const directType = Object.is(_direct, isSwitchUnread ? 3 : 4)
          const fieldName = isSwitchUnread ? 'isUnread' : 'isStar'
          dataSource = oldDataSource.map(item => ({
            ...item,
            checked: directType ? item[fieldName] : !item[fieldName]
          }))
          break
        default:
          return
      }
      yield put({
        type: 'upState',
        payload: {
          dataSource
        }
      })
    },
    *selectOrStarItem({ payload }, { select, put }) {
      // 选中单个条目切换,标记星标切换
      const {
        dataSource: oldDataSource,
        noticeData: oldNoticeData
      } = yield select(({ inbox }) => inbox)
      let dataSource = oldDataSource
      let noticeData = oldNoticeData
      const { itemData = {}, isSelectedCheckbox } = payload
      const { id = '' } = itemData
      if (!id) return
      const index = findItemIndex(dataSource, id)
      if (index === -1) return
      const { checked, isStar: oldIsStar } = dataSource[index]
      const fieldName = isSelectedCheckbox ? 'checked' : 'isStar'
      dataSource[index] = {
        ...dataSource[index],
        [fieldName]: isSelectedCheckbox ? !checked : !oldIsStar
      }
      if (!isSelectedCheckbox) {
        //更新星标数量
        noticeData = countNoticeNum(dataSource, oldNoticeData)
      }
      yield put({
        type: 'upState',
        payload: {
          dataSource,
          noticeData
        }
      })
    },
    *operateInboxItem({ payload }, { select, put }) {
      //direct 与operateList direct键操作相对应
      const _direct = getDirect(payload)
      if (!isNumber(_direct)) return
      const {
        dataSource: oldDataSource,
        noticeData: oldNoticeData
      } = yield select(({ inbox }) => inbox)
      let dataSource = oldDataSource
      let noticeData = oldNoticeData
      switch (_direct) {
        case 3:
        case 4:
          const isUnread = Object.is(_direct, 3)
          dataSource = oldDataSource.map(item => ({
            ...item,
            isUnread: item.checked ? isUnread : item.isUnread
          }))
          noticeData = countNoticeNum(dataSource, oldNoticeData)
          break
        default:
          const { operateText } = payload
          operateText && message.info(`${operateText}功能待完善！`)
          break
      }
      yield put({
        type: 'upState',
        payload: {
          dataSource,
          noticeData
        }
      })
    }
  }
}
