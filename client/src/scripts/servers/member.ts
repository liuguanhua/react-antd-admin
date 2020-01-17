import request from '../common'
import api from '../common/api'

const { addMember, updateMember, deleteMember } = api

//添加或更新会员
export const addOrUpdateMember = (data: IKeyStringProps) => {
  const { userId } = data
  return request({
    method: 'post',
    url: `${userId ? `${updateMember}/${userId}` : addMember}`,
    data
  })
}

//删除会员
export const goDeleteMember = (userId: string) => {
  return request({
    method: 'post',
    url: `${deleteMember}/${userId}`
  })
}
