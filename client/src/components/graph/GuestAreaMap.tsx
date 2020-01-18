import React, { useEffect, useState } from 'react'
import Highcharts from 'highcharts'
import HC_map from 'highcharts/modules/map'
import HighchartsReact from 'highcharts-react-official'
import { isArray } from 'util'

import { ICardChildProps } from '@scripts/types'

import { fetchGeoWorld } from '@scripts/servers'

import globalMapData from '@store/mock/globalMapData.json'
import { CoverWaitContent } from '@components/common'
import { SkeletonGuestAreaMap } from '@components/skeleton'
import { useFetchStage } from '@components/hooks'

HC_map(Highcharts)
;(Highcharts.maps as IKeyStringProps)['world'] = globalMapData
// Highcharts['theme'] = {
//   colors: [
//     '#1890ff',
//     '#90ee7e',
//     '#f45b5b',
//     '#7798BF',
//     '#aaeeee',
//     '#ff0066',
//     '#eeaaee',
//     '#55BF3B',
//     '#DF5353',
//     '#7798BF',
//     '#aaeeee'
//   ],
//   chart: {
//     backgroundColor: {
//       linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
//       stops: [[0, '#2a2a2b'], [1, '#3e3e40']]
//     },
//     style: {
//       fontFamily: "'Unica One', sans-serif"
//     },
//     plotBorderColor: '#606063'
//   },
//   title: {
//     style: {
//       color: '#E0E0E3',
//       textTransform: 'uppercase',
//       fontSize: '20px'
//     }
//   },
//   subtitle: {
//     style: {
//       color: '#E0E0E3',
//       textTransform: 'uppercase'
//     }
//   },
//   xAxis: {
//     gridLineColor: '#707073',
//     labels: {
//       style: {
//         color: '#E0E0E3'
//       }
//     },
//     lineColor: '#707073',
//     minorGridLineColor: '#505053',
//     tickColor: '#707073',
//     title: {
//       style: {
//         color: '#A0A0A3'
//       }
//     }
//   },
//   yAxis: {
//     gridLineColor: '#707073',
//     labels: {
//       style: {
//         color: '#E0E0E3'
//       }
//     },
//     lineColor: '#707073',
//     minorGridLineColor: '#505053',
//     tickColor: '#707073',
//     tickWidth: 1,
//     title: {
//       style: {
//         color: '#A0A0A3'
//       }
//     }
//   },
//   tooltip: {
//     backgroundColor: 'rgba(0, 0, 0, 0.85)',
//     style: {
//       color: '#F0F0F0'
//     }
//   },
//   plotOptions: {
//     series: {
//       dataLabels: {
//         color: '#B0B0B3'
//       },
//       marker: {
//         lineColor: '#333'
//       }
//     },
//     boxplot: {
//       fillColor: '#505053'
//     },
//     candlestick: {
//       lineColor: 'white'
//     },
//     errorbar: {
//       color: 'white'
//     }
//   },
//   legend: {
//     itemStyle: {
//       color: '#E0E0E3'
//     },
//     itemHoverStyle: {
//       color: '#FFF'
//     },
//     itemHiddenStyle: {
//       color: '#606063'
//     }
//   },
//   credits: {
//     style: {
//       color: '#666'
//     }
//   },
//   labels: {
//     style: {
//       color: '#707073'
//     }
//   },

//   drilldown: {
//     activeAxisLabelStyle: {
//       color: '#F0F0F3'
//     },
//     activeDataLabelStyle: {
//       color: '#F0F0F3'
//     }
//   },

//   navigation: {
//     buttonOptions: {
//       symbolStroke: '#DDDDDD',
//       theme: {
//         fill: '#505053'
//       }
//     }
//   },

//   // scroll charts
//   rangeSelector: {
//     buttonTheme: {
//       fill: '#505053',
//       stroke: '#000000',
//       style: {
//         color: '#CCC'
//       },
//       states: {
//         hover: {
//           fill: '#707073',
//           stroke: '#000000',
//           style: {
//             color: 'white'
//           }
//         },
//         select: {
//           fill: '#000003',
//           stroke: '#000000',
//           style: {
//             color: 'white'
//           }
//         }
//       }
//     },
//     inputBoxBorderColor: '#505053',
//     inputStyle: {
//       backgroundColor: '#333',
//       color: 'silver'
//     },
//     labelStyle: {
//       color: 'silver'
//     }
//   },

//   navigator: {
//     handles: {
//       backgroundColor: '#666',
//       borderColor: '#AAA'
//     },
//     outlineColor: '#CCC',
//     maskFill: 'rgba(255,255,255,0.1)',
//     series: {
//       color: '#7798BF',
//       lineColor: '#A6C7ED'
//     },
//     xAxis: {
//       gridLineColor: '#505053'
//     }
//   },

//   scrollbar: {
//     barBackgroundColor: '#808083',
//     barBorderColor: '#808083',
//     buttonArrowColor: '#CCC',
//     buttonBackgroundColor: '#606063',
//     buttonBorderColor: '#606063',
//     rifleColor: '#FFF',
//     trackBackgroundColor: '#404043',
//     trackBorderColor: '#404043'
//   },

//   // special colors for some of the
//   legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
//   background2: '#505053',
//   dataLabelsColor: '#B0B0B3',
//   textColor: '#C0C0C0',
//   contrastTextColor: '#F0F0F3',
//   maskColor: 'rgba(255,255,255,0.3)'
// }

// Highcharts.setOptions(Highcharts['theme'])

const getOptions = (data: TSetKeyStringProps) => {
  return {
    chart: {
      map: 'world',
      height: 384,
      margin: 5,
      backgroundColor: '1890ff'
    },
    legend: {
      enabled: false
    },
    title: {
      text: ''
    },
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: 'bottom'
      }
    },

    series: [
      {
        name: 'Countries',
        color: '#E0E0E0',
        enableMouseTracking: false
      },
      {
        type: 'mapbubble',
        name: '用户数量',
        joinBy: ['iso-a3', 'code3'],
        data: data,
        minSize: 4,
        maxSize: '12%',
        tooltip: {
          pointFormatter: function() {
            // console.log(this)
            const { name } = this.options
            return `${name}(${this.z})`
          }
        }
      }
    ]
  }
}

const GuestAreaMap: React.FC<ICardChildProps> = ({ title }) => {
  const { loading, hideLoading } = useFetchStage()
  const [options, setOptions] = useState({})
  useEffect(() => {
    fetchGeoWorld().then(res => {
      if (isArray(res)) {
        setOptions(getOptions(res))
        hideLoading()
      }
    })
  }, [])
  return (
    <CoverWaitContent
      loading={loading}
      loadingPlaceholder={<SkeletonGuestAreaMap />}
    >
      {title}
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={'mapChart'}
        options={options}
      />
    </CoverWaitContent>
  )
}

export default GuestAreaMap
