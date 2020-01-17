import React from 'react'
import { Layout, Icon } from 'antd'
import { connect } from 'dva'

import styles from '@styles/sass/page/message.module.scss'

import { MAIN_SCOPE_NUM } from '@scripts/helper'

import WrapInboxMenu from './InboxMenu'
import { SvgIcon, BegetDrawer, BegetSider } from '@components/common'
import WrapInboxTable from './InboxContent'
import { useModal } from '@components/hooks'

import { ReactComponent as InboxBtnmenu } from '@fonts/svg/inbox/btnmenu.svg'

const { inbox_drawer_wrapper } = styles
const { Content } = Layout

interface IInboxProps {
  foldMenu?: boolean
}

const SiderInboxMenu: React.FC<IInboxProps> = ({ foldMenu }) => {
  return (
    <BegetSider
      style={{
        overflowY: 'auto',
        ...(foldMenu && {
          margin: -MAIN_SCOPE_NUM
        })
      }}
    >
      <WrapInboxMenu />
    </BegetSider>
  )
}

const Inbox: React.FC<IInboxProps> = ({ foldMenu }) => {
  const [isShow, { showModal: showDrawer, hideModal: hideDrawer }] = useModal()
  return (
    <Layout className="inside-container">
      {!foldMenu && <SiderInboxMenu />}
      <Content className="bg-color-white inside-padding-container">
        <WrapInboxTable
          extraOperateContent={
            foldMenu ? (
              <span
                onClick={showDrawer}
                className="font-size-xxl locate-very t0 r0"
              >
                <Icon
                  className="cursign"
                  component={() => <SvgIcon component={InboxBtnmenu} />}
                />
              </span>
            ) : null
          }
        />
        {foldMenu && (
          <BegetDrawer
            title={`\u00A0`}
            visible={isShow}
            onClose={hideDrawer}
            placement="left"
            width="200"
            className={inbox_drawer_wrapper}
          >
            <SiderInboxMenu foldMenu={foldMenu} />
          </BegetDrawer>
        )}
      </Content>
    </Layout>
  )
}

export default connect(({ global }) => ({ ...global }))(Inbox)
