import React, { useState, useEffect } from 'react'
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts'
import { isArray } from 'util'
import { DataSet } from '@antv/data-set'

import { ICardChildProps } from '@scripts/types'

import { STYLE_TEXT_ROW } from '@scripts/constant'
import { getHotProduct } from '@scripts/servers'
import { useFetchStage } from '@components/hooks'
import { generateNumList } from '@scripts/utils'

import {
  CoverWaitContent,
  BegetReactPlaceholder,
  SkeletonCardTitle
} from '@components/common'

const ds = new DataSet()
const skeletonLength = generateNumList(5)
const SkeletonLikeProductList = () => {
  return (
    <>
      <SkeletonCardTitle />
      {skeletonLength.map(num => (
        <BegetReactPlaceholder
          key={num}
          type="textRow"
          style={STYLE_TEXT_ROW}
        />
      ))}
      <BegetReactPlaceholder
        type="textRow"
        style={{
          height: 18,
          width: 190,
          margin: '38px auto 0'
        }}
      />
    </>
  )
}

export const LikeProductList: React.FC<ICardChildProps> = ({ title }) => {
  const { loading, hideLoading } = useFetchStage()
  const [info, setInfo] = useState<{
    dateList: string[]
    data: TSetKeyStringProps
  }>({
    dateList: [],
    data: []
  })
  useEffect(() => {
    getHotProduct().then(res => {
      const { info, dateList } = res
      if (isArray(info)) {
        setInfo({
          dateList,
          data: info
        })
        hideLoading()
      }
    })
  }, [])
  const { dateList, data } = info
  const dv = ds.createView().source(data)
  dateList.length &&
    dv.transform({
      type: 'fold',
      fields: dateList,
      key: '月份',
      value: '销售额'
    })
  return (
    <CoverWaitContent
      loading={loading}
      loadingPlaceholder={<SkeletonLikeProductList />}
    >
      {title}
      <Chart padding="auto" height={379} data={dv} forceFit>
        <Axis name="月份" />
        <Axis name="销售额" />
        <Legend />
        <Tooltip
          crosshairs={{
            type: 'y'
          }}
        />
        <Geom
          type="interval"
          position="月份*销售额"
          color={'name'}
          adjust={[
            {
              type: 'dodge',
              marginRatio: 1 / 32
            }
          ]}
        />
      </Chart>
    </CoverWaitContent>
  )
}
