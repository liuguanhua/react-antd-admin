import React, { useCallback, useState } from 'react'
import {
  PieChart,
  Pie,
  Legend,
  ResponsiveContainer,
  Cell,
  Sector,
  Tooltip
} from 'recharts'

import { randomRange } from '@scripts/utils'

const data: { key: number; name: string; value: number }[] = []
const goodsName: string[] = [
  '进口商品',
  '美容洗护',
  '家具家电',
  '食品饮料',
  '其它'
]

for (let index = 0; index < 5; index++) {
  data.push({
    key: index,
    name: goodsName[index],
    value: randomRange(10, 100)
  })
}

const renderActiveShape = props => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload
  } = props

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  )
}
const totalSales = data.reduce((info, item) => (info += item.value), 0)
const sty_remove_margin = {
  margin: 0
}

const CustomTooltip = props => {
  const { active, payload } = props
  if (active) {
    const { name, value } = payload[0]
    return (
      <div
        style={{
          padding: '0 10px',
          backgroundColor: 'rgb(255, 255, 255,.5)',
          border: '1px solid rgb(204, 204, 204)'
        }}
      >
        <p style={sty_remove_margin}>{`${name} : ${value}`}</p>
        <p style={sty_remove_margin}>
          {((value * 100) / totalSales).toFixed(2)}%
        </p>
      </div>
    )
  }
  return null
}
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#ff00b6']

const ShapePieChart: React.FC = () => {
  const [info, setInfo] = useState({
    activeIndex: 0,
    list: data
  })
  const { activeIndex, list } = info
  const onPieEnter = useCallback(index => {
    setInfo(v => ({ ...v, activeIndex: index }))
  }, [])
  const selectLegendEvent = useCallback(
    ({ payload }) => {
      const { key } = payload
      setInfo(v => ({
        ...v,
        list: list.map(item => {
          if (Object.is(item.key, key)) {
            item.value = 0
          }
          return item
        })
      }))
    },
    [list]
  )
  return (
    <ResponsiveContainer height={400}>
      <PieChart>
        <Legend onClick={selectLegendEvent} verticalAlign="top" />
        <Tooltip content={<CustomTooltip />} />
        <Pie
          data={list}
          cy={150}
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          innerRadius={70}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          onMouseEnter={onPieEnter}
        >
          {list.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

export default ShapePieChart
