import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  Guide
} from 'bizcharts'
import { DataSet } from '@antv/data-set'

import { ICardChildProps } from '@scripts/types'

import { getGoodsSalesInfo } from '@scripts/servers'
import { numToThousands, isValidArray } from '@scripts/utils'

import { CoverWaitContent } from '@components/common'
import { SkeletonSalesTrend } from '@components/skeleton'
import { useFetchStage } from '@components/hooks'

const { DataView } = DataSet
const { Html } = Guide
const dv = new DataView()
const formatRatioValue = (val: number): string =>
  parseInt((val * 100).toString(), 10) + '%'
const cols = {
  percent: {
    formatter: val => formatRatioValue(val)
  }
}

const SalesTrend: React.FC<ICardChildProps> = ({ title }) => {
  const chartInstance = useRef<IKeyStringProps>({})
  const { loading, hideLoading } = useFetchStage()
  const [data, setData] = useState([])
  const [selectedInfo, setSelectedInfo] = useState({ atName: '', atValue: 0 })
  const { atName, atValue } = selectedInfo
  const updateSelectedInfo = useCallback(
    ({ name, value }) => {
      if (!Object.is(atName, name)) {
        setSelectedInfo({
          atName: name,
          atValue: value
        })
      }
    },
    [atName]
  )
  const fetchData = useCallback(() => {
    getGoodsSalesInfo().then(res => {
      if (isValidArray(res)) {
        updateSelectedInfo(res[0])
        setData(res as [])
        hideLoading()
      }
    })
  }, [])
  useEffect(() => {
    fetchData()
  }, [])
  dv.source(data).transform({
    type: 'percent',
    field: 'value',
    dimension: 'name',
    as: 'percent'
  })
  return (
    <CoverWaitContent
      loading={loading}
      loadingPlaceholder={<SkeletonSalesTrend />}
    >
      {title}
      <Chart
        onGetG2Instance={chartIns => {
          chartInstance.current = chartIns
        }}
        onTooltipChange={ev => {
          // chartInstance.current.guide().html({
          //   position: ["50%", "50%"],
          //   html: `<div>测试</div>`
          // });
          // chartInstance.current.render();

          const items = ev.items //使用bizcharts版本>3.5.4，此处会触发Cannot read property 'getElementsByClassName' of undefined，具体还没解决方案
          const origin = items[0]
          // console.log(origin)
          updateSelectedInfo(origin.point._origin)
        }}
        height={379}
        data={dv}
        scale={cols}
        padding="auto"
        forceFit
      >
        <Coord type={'theta'} radius={0.75} innerRadius={0.6} />
        <Axis name="percent" />
        <Legend position="top" offsetY={10} />
        <Tooltip
          showTitle={false}
          itemTpl='<li>
            <span style="background-color:{color};" class="g2-tooltip-marker">
            </span>{name}: {value}
            </li>'
        />
        <Guide>
          <Html
            position={['50%', '50%']}
            html={`<div style="color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;">
            ${atName}<br><span style="color:#262626;font-size:2em">${numToThousands(
              atValue
            )}</span>
            </div>`}
            alignX="middle"
            alignY="middle"
          />
        </Guide>
        <Geom
          type="intervalStack"
          position="percent"
          color="name"
          tooltip={[
            'name*percent',
            (item, percent) => {
              return {
                name: item,
                value: formatRatioValue(percent)
              }
            }
          ]}
          style={{
            lineWidth: 2,
            stroke: '#fff'
          }}
        >
          <Label
            offset={30}
            content=" "
            htmlTemplate={(_, { color, point: { percent } }) => {
              return (
                '<span style="color:' +
                color +
                '">' +
                formatRatioValue(percent) +
                '</span>'
              )
            }}
          />
        </Geom>
      </Chart>
    </CoverWaitContent>
  )
}

export default SalesTrend
