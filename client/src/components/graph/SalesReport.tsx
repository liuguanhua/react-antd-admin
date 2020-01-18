import React, { useState, useEffect } from 'react'
import { Chart, Geom, Tooltip, Axis, Legend } from 'bizcharts'
import { Row, Col, Statistic } from 'antd'
import { isArray } from 'util'
import { DataSet } from '@antv/data-set'

import { ICardChildProps } from '@scripts/types'

import styles from '@styles/sass/page/home.module.scss'

import { getRankingSalesReport } from '@scripts/servers'
import { useFetchStage } from '@components/hooks'
import { CoverWaitContent } from '@components/common'
import { SkeletonSalesReport } from '@components/skeleton'

const { sales_front_wrapper } = styles
const scale = {
  value: {
    alias: 'The Share Price in Dollars',
    formatter: function(val) {
      return '$' + val
    }
  },
  time: {
    range: [0, 1]
  },
  type: {
    formatter: val => {
      return '销售金额'
    }
  }
}

const SalesReportChart: React.FC<{
  data?: TSetKeyStringProps
}> = ({ data = [] }) => {
  const dv = new DataSet.View().source(data)
  dv.transform({
    type: 'fold',
    fields: ['totalMoney'],
    key: 'type',
    value: 'value'
  })
  return (
    <Chart
      padding="0"
      height={138}
      background={{
        fill: '#1890ff',
        fillOpacity: 0.5
      }}
      data={dv}
      scale={scale}
      forceFit
    >
      <Tooltip crosshairs />
      <Axis />
      <Legend />
      <Geom
        type="area"
        position="time*value"
        color={['type', '#2ca6a6']}
        shape="smooth"
      />
    </Chart>
  )
}

const SalesReport: React.FC<ICardChildProps> = ({ title }) => {
  const { loading, hideLoading } = useFetchStage()
  const [data, setData] = useState<IKeyStringProps>({})
  useEffect(() => {
    getRankingSalesReport().then(res => {
      if (isArray(res.lastSalesReportData)) {
        setData(res)
        hideLoading()
      }
    })
  }, [])
  const {
    yesterDayMoney,
    todayMoney,
    eyeMoney,
    lastSalesReportData = []
  } = data
  const salesFrontMoney = [
    {
      money: eyeMoney,
      name: '前天'
    },
    {
      money: yesterDayMoney,
      name: '昨天'
    },
    {
      money: todayMoney,
      name: '今天'
    }
  ]
  const limitHalf = (lastSalesReportData.length / 2) | 0
  return (
    <CoverWaitContent
      loading={loading}
      loadingPlaceholder={<SkeletonSalesReport />}
    >
      {title}
      <div
        style={{
          lineHeight: 0
        }}
      >
        <SalesReportChart data={lastSalesReportData.slice(0, limitHalf)} />
        <SalesReportChart data={lastSalesReportData.slice(limitHalf)} />
      </div>
      <Row
        className={`tc ${sales_front_wrapper}`}
        type="flex"
        justify="space-between"
        align="middle"
      >
        {salesFrontMoney.map(({ name, money }, key) => (
          <Col className="sales-front-item" key={key} xs={24} sm={8}>
            <h3 className="font-size-xxl ellipsis">
              $<Statistic className="inline-block" value={money} />
            </h3>
            <p>{name}</p>
          </Col>
        ))}
      </Row>
    </CoverWaitContent>
  )
}

export default SalesReport
