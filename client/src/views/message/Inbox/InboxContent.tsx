import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Icon, Menu, Checkbox, Tooltip, message } from 'antd'
import { SelectParam } from 'antd/lib/menu'
import { connect } from 'dva'
import { DispatchProp } from 'react-redux'
import { isNumber } from 'util'

import { TColumnType } from '@scripts/types'
import styles from '@styles/sass/page/message.module.scss'

import { addUseField, countNoticeNum } from '@scripts/utils'

import { beforeFetchData } from '@components/high-order'
import { TableControl } from '@components/table'
import { BegetPopover, SvgIcon, BegetMenu } from '@components/common'

import { ReactComponent as InboxUnread } from '@fonts/svg/inbox/unread.svg'
import { ReactComponent as InboxHaveread } from '@fonts/svg/inbox/haveread.svg'
import { ReactComponent as InboxForward } from '@fonts/svg/inbox/forward.svg'
import { ReactComponent as InboxMove } from '@fonts/svg/inbox/move.svg'
import { EOperateInboxDirect, EInboxMoveMenu } from '@scripts/types/EnumType'
import { IInboxProps } from './InboxMenu'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'

const { inbox_content_wraper } = styles
const diffTimeSize = (time1: Date, time2: Date) =>
  +new Date(time1) - +new Date(time2)

type TOnSelect = (record: IKeyStringProps, isSelectedCheckbox?: boolean) => void
const createInboxColumns = (onSelect: TOnSelect = () => {}) => {
  const columns: TColumnType = [
    {
      dataIndex: 'checked',
      width: 80,
      align: 'center',
      fixed: 'left',
      render: (checked = false, record: IKeyStringProps) => (
        <>
          <Checkbox
            onChange={() => {
              onSelect(record, true)
            }}
            onClick={e => {
              e.stopPropagation()
            }}
            checked={checked}
          />
          <Icon
            className="mgl cursign"
            type="star"
            onClick={e => {
              e.stopPropagation()
              onSelect(record)
            }}
            {...(record.isStar && {
              theme: 'filled'
            })}
          />
        </>
      )
    },
    {
      title: '发件人',
      dataIndex: 'sender',
      width: 150,
      align: 'center'
    },
    {
      title: '主题',
      dataIndex: 'subject'
    },
    {
      title: '时间',
      dataIndex: 'datetime',
      width: 175,
      sorter: (a: IKeyStringProps, b: IKeyStringProps) =>
        diffTimeSize(a.datetime, b.datetime),
      align: 'center'
    }
  ]
  return columns
}

interface IOperateListProps {
  icon?: string
  text: string
  component?: React.ReactNode
  direct: number
}
const OPERAE_HEIGHT = 50
const operateList: IOperateListProps[] = [
  {
    icon: 'exclamation-circle',
    text: '标记为垃圾邮件',
    direct: 0
  },
  {
    icon: 'delete',
    text: '删除',
    direct: 1
  },
  {
    // icon: 'snippets',
    text: '转发',
    component: <SvgIcon width={0.9} height={0.9} component={InboxForward} />,
    direct: 2
  },
  {
    component: <SvgIcon component={InboxUnread} />,
    text: '标记为未读',
    direct: 3
  },
  {
    component: <SvgIcon component={InboxHaveread} />,
    text: '标记为已读',
    direct: 4
  }
]
const filterOperateName = (data: IKeyStringProps) =>
  Object.keys(data).filter(v => isNaN(+v))
const DropdownInboxMenu: React.FC<{
  menuData: string[]
  onSelect?: (param: SelectParam) => void
}> = ({ onSelect, menuData }) => {
  return (
    <BegetMenu
      {...(onSelect && {
        onSelect
      })}
      className="md-menu-wrapper"
    >
      {menuData.map((name, key) => (
        <Menu.Item key={key}>{name}</Menu.Item>
      ))}
    </BegetMenu>
  )
}

const operateMenuInfo = filterOperateName(EOperateInboxDirect)
const DropdownOperateMenu: React.FC<DispatchProp> = ({ dispatch }) => {
  const onSelect = useCallback(({ key: direct }: SelectParam) => {
    dispatch({
      type: 'inbox/selectInboxItem',
      payload: {
        direct
      }
    })
  }, [])
  return <DropdownInboxMenu onSelect={onSelect} menuData={operateMenuInfo} />
}
const WrapDropdownOperateMenu = connect(({ inbox }) => ({ inbox }))(
  DropdownOperateMenu
)

const moveMenuInfo = filterOperateName(EInboxMoveMenu)
const DropdownMoveMenu: React.FC = () => {
  const onSelect = useCallback(({ key }: SelectParam) => {
    const text = moveMenuInfo[key]
    text && message.info(`${text}功能待完善！`)
  }, [])
  return <DropdownInboxMenu onSelect={onSelect} menuData={moveMenuInfo} />
}

interface IOperateInboxProps {
  extraOperateContent?: React.ReactNode
}

const OperateInbox: React.FC<{
  isShadow?: boolean
  dataSource?: TSetKeyStringProps
} & DispatchProp &
  IOperateInboxProps> = ({
  isShadow = false,
  dispatch,
  dataSource = [],
  extraOperateContent
}) => {
  const [info, setInfo] = useState({
    visible: false,
    showMove: false
  })
  const { visible, showMove } = info
  const onCheckAllChange = useCallback((e: CheckboxChangeEvent) => {
    dispatch({
      type: 'inbox/selectInboxItem',
      payload: {
        direct: +!e.target.checked
      }
    })
  }, [])
  const handleClickOperateMenu = useCallback((data: IOperateListProps) => {
    const { direct, text: operateText } = data
    dispatch({
      type: 'inbox/operateInboxItem',
      payload: {
        direct: +direct,
        operateText
      }
    })
  }, [])
  const checkAll = dataSource.length
    ? dataSource.every(item => item.checked)
    : false
  const isShow = dataSource.some(item => item.checked)
  return (
    <div
      style={{
        height: OPERAE_HEIGHT,
        ...(isShadow && {
          boxShadow: '0 5px 2px -2px #331e1e1c'
        })
      }}
      className="locate-fit"
    >
      <Tooltip
        onVisibleChange={visible => {
          setInfo(v => ({ ...v, visible }))
        }}
        visible={visible}
        placement="bottom"
        title="选择"
      >
        <span className="inbox-operate-icon">
          <Checkbox
            className="custom-checkbox-wrapper"
            onChange={onCheckAllChange}
            checked={checkAll}
          />
          <BegetPopover
            overlayClassName="custom-menu-popover"
            content={<WrapDropdownOperateMenu />}
            trigger="click"
            onVisibleChange={() => {
              setInfo(v => ({ ...v, visible: false }))
            }}
          >
            <Icon
              className="font-size-md cursign"
              style={{
                verticalAlign: 'inherit',
                marginLeft: 5
              }}
              type="caret-down"
            />
          </BegetPopover>
        </span>
      </Tooltip>
      <span
        style={{
          visibility: isShow ? 'visible' : 'hidden'
        }}
      >
        {operateList.map(item => {
          const { icon, text, component, direct } = item
          const OperateIcon = (icon || component) && (
            <Icon
              {...(icon && {
                type: icon
              })}
              {...(component && {
                component: () => <>{component}</>
              })}
            />
          )
          return (
            <span
              className="font-size-xxl inbox-operate-icon cursign"
              key={direct}
              onClick={() => {
                handleClickOperateMenu(item)
              }}
            >
              {text ? (
                <Tooltip placement="bottom" title={text}>
                  {OperateIcon}
                </Tooltip>
              ) : (
                OperateIcon
              )}
            </span>
          )
        })}
        <Tooltip
          visible={showMove}
          onVisibleChange={showMove => {
            setInfo(v => ({ ...v, showMove }))
          }}
          placement="bottom"
          title="移动至"
        >
          <BegetPopover
            overlayClassName="custom-menu-popover"
            content={<DropdownMoveMenu />}
            trigger="click"
            onVisibleChange={() => {
              setInfo(v => ({ ...v, showMove: false }))
            }}
          >
            <span className="font-size-xxl cursign">
              <Icon component={() => <SvgIcon component={InboxMove} />} />
            </span>
          </BegetPopover>
        </Tooltip>
      </span>
      {extraOperateContent}
    </div>
  )
}

const InboxContent = beforeFetchData<
  DispatchProp & IInboxProps & IOperateInboxProps
>({
  isPagination: true,
  url: 'getMessgeInbox',
  params: {
    pageSize: 15
  }
})(
  ({
    serveData,
    fetchData,
    dispatch,
    extraOperateContent,
    inbox: { dataSource = [] }
  }) => {
    const [isShadow, setIsShadow] = useState(false)
    const refInboxCnt = useRef<HTMLDivElement>(null)
    const handleTableScroll = useCallback(
      (event: Event) => {
        const target = event.target
        if (target instanceof HTMLDivElement) {
          const scrollTopNum = target.scrollTop
          if (scrollTopNum) {
            return !isShadow && setIsShadow(true)
          }
          isShadow && setIsShadow(false)
        }
      },
      [isShadow]
    )
    const onSelect: TOnSelect = useCallback((itemData, isSelectedCheckbox) => {
      dispatch({
        type: 'inbox/selectOrStarItem',
        payload: {
          isSelectedCheckbox,
          itemData
        }
      })
    }, [])
    const columns = createInboxColumns(onSelect)
    useEffect(() => {
      const { data = [], totalUnreadNum, totalStarNum } = serveData
      const dataSource = addUseField({
        data
      })
      const totalNoticeNum = totalUnreadNum + totalStarNum
      const {
        totalStarNum: currentTotalStarNum,
        totalUnreadNum: currentTotalUnreadNum
      } = countNoticeNum(dataSource)
      dispatch({
        type: 'inbox/upState',
        payload: {
          dataSource,
          noticeData: {
            totalUnreadNum,
            totalStarNum,
            lastTotalUnreadNum: totalUnreadNum - currentTotalUnreadNum,
            lastTotalStarNum: totalStarNum - currentTotalStarNum,
            totalNoticeNum: isNumber(totalNoticeNum) ? totalNoticeNum : 0
          }
        }
      })
    }, [serveData])
    useEffect(() => {
      const { current } = refInboxCnt
      const refTable = current!.querySelector('.ant-table-wrapper')
      if (!refTable) return
      if (isShadow) refTable.scrollTop = 0
      refTable.addEventListener('scroll', handleTableScroll)
      return () => {
        refTable.removeEventListener('scroll', handleTableScroll)
      }
    }, [serveData, isShadow])
    return (
      <div ref={refInboxCnt} className={`h-100 ${inbox_content_wraper}`}>
        <OperateInbox
          dispatch={dispatch}
          dataSource={dataSource}
          isShadow={isShadow}
          extraOperateContent={extraOperateContent}
        />
        <TableControl
          style={{
            maxHeight: `calc(100% - ${OPERAE_HEIGHT}px)`,
            overflowY: 'auto'
          }}
          className="table-xl-wrapper" //"custom-large-table"
          scroll={{ x: 1100 }}
          fetchData={fetchData}
          bordered={false}
          info={serveData}
          dataSource={dataSource}
          columns={columns}
          onRow={record => ({
            onClick: () => {
              onSelect(record, true)
            }
          })}
          rowClassName={(record: IKeyStringProps) => {
            const { isUnread, checked } = record
            const clsName = checked
              ? 'selected-inbox-row'
              : isUnread
              ? 'bg-light-gray'
              : ''
            return `${clsName ? `${clsName} ` : ''}cursign`
          }}
        />
      </div>
    )
  }
)

export default connect(({ inbox }) => ({ inbox }))(
  InboxContent
) as React.ComponentType<IOperateInboxProps>
