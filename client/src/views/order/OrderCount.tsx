import React from 'react'
import Highcharts from 'highcharts'
import HC_map from 'highcharts/modules/map'
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsReact from 'highcharts-react-official'
import mock from 'mockjs'

import chinaMapData from '@store/mock/chinaMapData.json'
import { generateNumList } from '@scripts/utils'
import { MAIN_SCOPE_NUM } from '@scripts/helper'

const { Random } = mock

HC_map(Highcharts)
if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts)
}
const { theme = {} } = Highcharts as any

const limitData = generateNumList(8)
const limitLen = limitData.length - 1
const { fromNum, incrementNum, takeNum } = {
  fromNum: 1e5, //起点数值,
  incrementNum: 1e5, //递增数值
  takeNum: 5 * 1e4 //最大值加一定的数，适配到dataClasses范围中
}
const lastFromNum = fromNum + incrementNum * limitLen

const getData = mapData => {
  const randomMaxNum = lastFromNum + takeNum
  return mapData.features.map(md => {
    const { drilldown = '' } = md.properties || {}
    const value = Random.natural(fromNum, randomMaxNum)
    return {
      name: md.properties.name,
      value,
      ...(drilldown && {
        drilldown
      })
    }
  })
}

export const dataClasses = (() => {
  const mapColorList = limitData.map(() => Random.color())
  return limitData.map(item => {
    const color = mapColorList[item]
    switch (true) {
      case !item:
        return {
          to: fromNum + incrementNum,
          color
        }
      case Object.is(item, limitLen):
        return {
          from: lastFromNum,
          color
        }
      default:
        return {
          from: fromNum + incrementNum * item,
          to: fromNum + incrementNum * (item + 1),
          color
        }
    }
  })
})()

const initOptions: Highcharts.Options = {
  chart: {
    margin: MAIN_SCOPE_NUM
    // map: 'world',
    // width: '100%',
    // height: '50%'
    // events: {
    //   drillup: function() {
    //     map.setTitle({
    //       text: '中国'
    //     })
    //   }
    // }
  },
  title: {
    text: '订单交易量'
  },
  mapNavigation: {
    enabled: true,
    buttonOptions: {
      verticalAlign: 'bottom'
    }
  },
  legend: {
    // enabled: false
    title: {
      style: {
        color: (theme && theme.textColor) || 'black'
      }
    },
    align: 'left',
    verticalAlign: 'top',
    floating: true,
    layout: 'vertical',
    // valueDecimals: 0,
    backgroundColor:
      (theme && theme.legendBackgroundColor) || 'rgba(255, 255, 255, 0.85)',
    symbolRadius: 0,
    symbolHeight: 14
  },
  tooltip: {
    useHTML: true,
    headerFormat: '<h3 style="margin:0">订单量</h3>',
    pointFormat: '<div>{point.name}: {point.value}</div>'
  },
  colorAxis: {
    dataClasses
  },
  series: [
    {
      type: 'map',
      data: getData(chinaMapData),
      mapData: chinaMapData,
      joinBy: 'name',
      states: {
        hover: {
          color: '#a4edba'
        }
      }
    }
  ]
}

interface IOrderCountProps {}

const OrderCount: React.FC<IOrderCountProps> = () => {
  return (
    <div layout-flex="auto" className="bg-color-white h-100">
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={'mapChart'}
        options={initOptions}
      />
    </div>
  )
}

export default OrderCount
