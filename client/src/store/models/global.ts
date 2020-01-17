import { Reducer } from 'redux'

import { isMobile } from '@scripts/helper'
import { configInfo } from '@scripts/utils'

export default {
  namespace: 'global',
  state: {
    userInfo: {},
    configInfo,
    foldMenu: isMobile(),
    collapsed: false
  },
  reducers: {
    upState(state: Reducer<{}>, { data }: IKeyStringProps) {
      return {
        ...state,
        ...data
      }
    }
  },
  effects: {}
}
