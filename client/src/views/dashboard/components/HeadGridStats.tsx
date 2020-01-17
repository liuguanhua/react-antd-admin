import React, { useState, useEffect, useCallback } from 'react'
import { Col, Icon } from 'antd'
import CountUp from 'react-countup'
import { isArray } from 'util'
import { Random } from 'mockjs'

import styles from '@styles/sass/page/home.module.scss'

import { getMallCountQuantity } from '@scripts/servers'
import { numToThousands } from '@scripts/utils'

import { useFetchStage } from '@components/hooks'
import { BegetReactPlaceholder, CoverWaitContent } from '@components/common'

export const SkeletonList = () => {
  return (
    <>
      {iconList.map(icon => {
        return (
          <Col key={icon} sm={12} lg={12} xl={6} className={grid_item}>
            <div
              layout-align="start center"
              className="item-card bg-color-white"
            >
              <div layout-flex="none">
                <BegetReactPlaceholder
                  type="round"
                  style={{
                    width: 74,
                    height: 74,
                    marginLeft: -8
                  }}
                />
              </div>
              <div style={{ paddingLeft: '10%' }}>
                <BegetReactPlaceholder
                  type="textRow"
                  style={{
                    width: 124,
                    height: 34,
                    marginTop: 0
                  }}
                />
                <BegetReactPlaceholder
                  type="textRow"
                  style={{
                    width: 64,
                    height: 20
                  }}
                />
              </div>
            </div>
          </Col>
        )
      })}
    </>
  )
  /* return (
    <BegetContentLoader height={118}>
      <circle cx="52" cy="60" r="37"></circle>
      <rect x="150" y="30" width="170" height="25"></rect>
      <rect x="114" y="70" width="70" height="22"></rect>
    </BegetContentLoader>
  ) */
}

const { grid_item, grid_inside } = styles
const iconList: string[] = ['shopping', 'pay-circle', 'user', 'eye']

export default function HeadGridStats() {
  const { loading, hideLoading } = useFetchStage()
  const [infoList, setInfoList] = useState([])
  const fetchData = useCallback(() => {
    getMallCountQuantity().then(res => {
      if (isArray(res)) {
        res = res.map((item, key) => {
          return {
            ...item,
            icon: iconList[key],
            start: Random.natural(800, 1000)
          }
        })
        setInfoList(res)
        hideLoading()
      }
    })
  }, [])
  useEffect(() => {
    fetchData()
  }, [])
  return (
    <CoverWaitContent loading={loading} loadingPlaceholder={<SkeletonList />}>
      {infoList.map(item => {
        const { num, name, start, icon } = item
        return (
          <Col key={name} sm={12} lg={12} xl={6} className={grid_item}>
            <div
              layout-align="start center"
              className={`item-card ${grid_inside}`}
            >
              {icon && <Icon type={icon} />}
              <div>
                <h2>
                  <CountUp
                    start={start}
                    end={num}
                    formattingFn={value => numToThousands(value)}
                  />
                </h2>
                <h3>{name}</h3>
              </div>
            </div>
          </Col>
        )
      })}
    </CoverWaitContent>
  )
}
