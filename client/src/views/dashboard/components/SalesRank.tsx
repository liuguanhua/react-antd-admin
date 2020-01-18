import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Card, Col, Menu, Dropdown, Icon } from 'antd'
import { CardTabListType } from 'antd/lib/card'

import styles from '@styles/sass/page/home.module.scss'

import { getSalesRankingInfo } from '@scripts/servers'
import { addUseField } from '@scripts/utils'

import { TableControl } from '@components/table'
import salesRankColumns, { tableRowRecord } from './SalesColumns'
import { GuestAreaMap } from '@components/graph'
import {
  CardHeadTitle,
  CoverWaitContent,
  CardItemContainer
} from '@components/common'
import { SkeletonSalesRank } from '@components/skeleton'
import { useFetchStage } from '@components/hooks'

const { card_tab, home_sales_table } = styles

const PopupMenu = (
  <Menu>
    <Menu.Item>今日排行</Menu.Item>
    <Menu.Item>月度排行</Menu.Item>
    <Menu.Item>年度排行</Menu.Item>
  </Menu>
)

const ExtraOpeart = (
  <Dropdown overlay={PopupMenu} placement="bottomRight">
    <Icon className="font-size-md cursign" type="ellipsis" />
  </Dropdown>
)

const tabList: CardTabListType[] = [
  {
    key: '0',
    tab: '产品销售'
  },
  {
    key: '1',
    tab: '客户购买'
  },
  {
    key: '2',
    tab: '地区购买'
  },
  {
    key: '3',
    tab: '供应商商品'
  },
  {
    key: '4',
    tab: '业务员'
  }
]

export default function SalesRank() {
  const keepData = useRef({
    isFirstLoad: true
  })
  const refWrapTable = useRef<HTMLDivElement>(null)
  const { loading, hideLoading } = useFetchStage()
  const [activeKey, setActiveKey] = useState('0')
  const [rankingInfo, setRankingInfo] = useState({
    data: []
  })
  const { data = [] } = rankingInfo || {}
  const { isFirstLoad } = keepData.current
  const fetchData = useCallback(
    ({ pageIndex = 1, callback = () => {} }: IBeforeFetchOptionProps = {}) => {
      tableRowRecord.pageIndex = pageIndex
      getSalesRankingInfo(activeKey, pageIndex)
        .then(res => {
          const { current } = refWrapTable
          if (res) {
            res.data = addUseField({
              data: res.data
            })
            setRankingInfo(state => ({
              ...state,
              ...res
            }))
            if (keepData.current.isFirstLoad) {
              keepData.current.isFirstLoad = false
              hideLoading()
            }
          }
          if (current) {
            const nodeTableContent = current.querySelector('.ant-table-content')
            if (!nodeTableContent) return
            if (nodeTableContent.scrollTop > 0) {
              nodeTableContent.scrollTop = 0
            }
          }
        })
        .finally(() => {
          callback()
        })
    },
    [activeKey]
  )
  useEffect(fetchData, [activeKey])
  const columns = salesRankColumns[activeKey] || []
  return (
    <>
      <Col sm={24} xl={12}>
        <div
          style={{
            padding: loading || isFirstLoad ? 20 : 0
          }}
          className="item-card bg-color-white"
        >
          <CoverWaitContent
            loading={loading}
            loadingPlaceholder={<SkeletonSalesRank />}
          >
            <Card
              className={`${card_tab} w-100`}
              tabList={tabList}
              title={
                <CardHeadTitle
                  text="销售榜单"
                  icon="bar-chart"
                  color="#727cb6"
                />
              }
              extra={ExtraOpeart}
              activeTabKey={activeKey}
              onTabChange={setActiveKey}
            >
              <div ref={refWrapTable}>
                <TableControl
                  info={rankingInfo}
                  columns={columns}
                  dataSource={data}
                  fetchData={fetchData}
                  className={home_sales_table}
                />
              </div>
            </Card>
          </CoverWaitContent>
        </div>
      </Col>
      <Col sm={24} xl={12}>
        <CardItemContainer>
          <GuestAreaMap
            title={
              <CardHeadTitle
                text="用户区域分布"
                icon="area-chart"
                color="#00acac"
              />
            }
          />
        </CardItemContainer>
      </Col>
    </>
  )
}
