import React from 'react'
import { Menu, Icon, Badge } from 'antd'
import { connect } from 'dva'

import { INoticeNumProps } from '@scripts/types'

import { SvgIcon, BegetMenu } from '@components/common'

import { ReactComponent as Send } from '@fonts/svg/inbox/send.svg'
import { ReactComponent as DraftBox } from '@fonts/svg/inbox/draftbox.svg'

const { SubMenu } = Menu

export interface IInboxProps {
  inbox: IKeyStringProps
}

interface IMenuDataProps {
  title: string
  icon?: string
  children?: IMenuDataProps[]
  component?: React.ReactNode
  noticeKey?: string
  // component?: React.ComponentType<CustomIconComponentProps>
}
const menuData: IMenuDataProps[] = [
  {
    title: '电子邮件',
    noticeKey: 'totalNoticeNum',
    children: [
      {
        title: '收件箱',
        icon: 'mail',
        noticeKey: 'totalUnreadNum'
      },
      {
        title: '已发送',
        // icon: 'rocket',
        component: <SvgIcon component={Send} />
      },
      {
        title: '星标邮件',
        icon: 'star',
        noticeKey: 'totalStarNum'
      },
      {
        title: '已删除',
        icon: 'delete'
      },
      {
        title: '草稿箱',
        // icon: 'save',
        component: <SvgIcon component={DraftBox} />
      },
      {
        title: '写信',
        icon: 'edit'
      }
    ]
  },
  {
    title: '分组',
    children: [
      {
        title: '公司',
        icon: 'folder'
      },
      {
        title: '家庭',
        icon: 'folder'
      },
      {
        title: '朋友',
        icon: 'folder'
      },
      {
        title: '同事',
        icon: 'folder'
      },
      {
        title: '同学',
        icon: 'folder'
      },
      {
        title: '重要人士',
        icon: 'folder'
      }
    ]
  }
]

const MenuItemTitle: React.FC<{
  data: IMenuDataProps
  noticeData?: INoticeNumProps
}> = ({ data, noticeData = {} }) => {
  const { icon, noticeKey = '', component, title } = data
  const count = noticeData[noticeKey]
  return (
    <>
      {(icon || component) && (
        <Icon
          {...(icon && {
            type: icon
          })}
          {...(component && {
            component: () => <>{component}</>
          })}
        />
      )}
      {count ? (
        <Badge offset={[24, 0]} count={count}>
          <span>{title}</span>
        </Badge>
      ) : (
        <span>{title}</span>
      )}
    </>
  )
}

const ChildMenuItem = ({
  data = [],
  parentKey = 0,
  noticeData
}: {
  data?: IMenuDataProps[]
  parentKey?: number | string
  noticeData?: INoticeNumProps
}) => {
  return data.map((item, key) => {
    return (
      <Menu.Item key={`${parentKey}-${key}`}>
        <MenuItemTitle noticeData={noticeData} data={item} />
      </Menu.Item>
    )
  })
}

const InboxMenu: React.FC<IInboxProps> = ({ inbox: { noticeData } }) => {
  return (
    <BegetMenu
      defaultSelectedKeys={['0-0']}
      defaultOpenKeys={['0', '1']}
      mode="inline"
      style={{ height: '100%' }}
    >
      {menuData.map((item, key) => {
        const { children } = item
        return (
          <SubMenu
            key={key}
            title={<MenuItemTitle noticeData={noticeData} data={item} />}
          >
            {ChildMenuItem({ data: children, parentKey: key, noticeData })}
          </SubMenu>
        )
      })}
    </BegetMenu>
  )
}

export default connect(({ inbox }) => ({ inbox }))(InboxMenu)
