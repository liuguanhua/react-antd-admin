import React, {
  useCallback,
  useEffect,
  useState,
  useImperativeHandle,
  useRef
} from 'react'
import { Form, Button, message } from 'antd'

import { FormComponentProps } from 'antd/lib/form'

import { addUseField, removeSpace } from '@scripts/utils'
import { addOrUpdateMember, goDeleteMember } from '@scripts/servers'

import { beforeFetchData, withGetRefs } from '@components/high-order'
import { TableControl } from '@components/table'
import { useModal } from '@components/hooks'
import {
  memberListColumns,
  IOperateMemberProps,
  TOperateMemberFunc
} from '../components'
import { BegetModal } from '@components/common'
import EditMemberItem from './EditMemberItem'
import SearchMemberForm, { ISearchMemberFormProps } from './SearchMemberForm'
import { IRefsProps } from '@components/high-order/withGetRefs'

interface IInquireMemberListProps {
  name?: string
  address?: string[]
  startTime?: string
  endTime?: string
}
interface IMemberListProps {}

const WrapSearchMemberForm: React.ComponentType<ISearchMemberFormProps> = (Form.create as any)()(
  SearchMemberForm
)

const MemberTable: React.ForwardRefExoticComponent<IBeforeFetchEmitProps &
  IInquireMemberListProps &
  IOperateMemberProps> = React.forwardRef(
  ({ serveData, fetchData, onEdit, ...rest }, ref) => {
    const { data } = serveData
    const onDelete: TOperateMemberFunc = useCallback(({ userId }) => {
      const text = '删除'
      goDeleteMember(userId)
        .then(res => {
          message.success(`${text}成功`)
          fetchData && fetchData()
        })
        .catch(() => {
          message.warning(`${text}失败`)
        })
    }, [])
    const columns = memberListColumns({ onDelete, onEdit, searchData: rest })
    const dataSource = addUseField({
      data
    })
    useImperativeHandle(ref, () => {
      return {
        fetchData
      }
    })
    return (
      <div className="mgt">
        <TableControl
          info={serveData}
          fetchData={fetchData}
          columns={columns}
          className="table-xl-wrapper"
          dataSource={dataSource}
          scroll={{ x: 1100 }}
        />
      </div>
    )
  }
)

const RefMemberTable = withGetRefs(MemberTable)

const WrapMemberTable = beforeFetchData<
  IInquireMemberListProps & IOperateMemberProps & IRefsProps
>({
  url: 'getMemberList',
  autoFetch: false,
  isPagination: true,
  hijack: false,
  params({ name, address, startTime, endTime }) {
    return { name, address, startTime, endTime }
  }
})(RefMemberTable, {
  executeComponent: ({ name, address, startTime, endTime, fetchData }) => {
    useEffect(() => {
      fetchData()
    }, [name, address, startTime, endTime])
    return null
  }
})

const MemberList: React.FC<FormComponentProps & IMemberListProps> = ({
  form
}) => {
  const { resetFields } = form
  const refMemberTable = useRef<IKeyStringProps>({})
  const [isShow, { showModal, hideModal }] = useModal()
  const [info, setInfo] = useState<IInquireMemberListProps>({})
  const [editInfo, setEditInfo] = useState<IKeyStringProps>({
    modalTitle: '',
    memberItemValue: {}
  })
  const { modalTitle, memberItemValue } = editInfo
  const onSearch = useCallback(value => {
    setInfo(v => ({ ...v, ...value }))
  }, [])
  const onEdit: TOperateMemberFunc = useCallback((value, event) => {
    const title = (event.target as HTMLElement).innerText || ''
    showModal()
    setEditInfo(v => ({
      ...v,
      modalTitle: `${removeSpace(title)}会员`,
      memberItemValue: value
    }))
  }, [])
  const onOk = useCallback(() => {
    const { validateFields } = form
    validateFields((err, values) => {
      if (!err) {
        addOrUpdateMember(values)
          .then(res => {
            const { current } = refMemberTable
            message.success(`${modalTitle}成功`)
            hideModal()
            current.fetchData && current.fetchData()
          })
          .catch(() => {
            message.warning(`${modalTitle}失败`)
          })
      }
    })
  }, [modalTitle])
  const getInstance = useCallback(instance => {
    refMemberTable.current = instance
  }, [])
  return (
    <div
      layout-flex="auto"
      className="bg-color-white inside-padding-container min-h-100"
    >
      <WrapSearchMemberForm onSearch={onSearch}>
        <Button className="mgl" icon="plus" onClick={onEdit.bind(null, {})}>
          添加
        </Button>
      </WrapSearchMemberForm>
      <WrapMemberTable getInstance={getInstance} onEdit={onEdit} {...info} />
      <BegetModal
        title={modalTitle}
        visible={isShow}
        onCancel={hideModal}
        onOk={onOk}
        afterClose={resetFields}
        extendStyle={{
          height: 550
        }}
      >
        <EditMemberItem form={form} value={memberItemValue} />
      </BegetModal>
    </div>
  )
}

export default Form.create()(MemberList)

//ref:china https://github.com/modood/Administrative-divisions-of-China
