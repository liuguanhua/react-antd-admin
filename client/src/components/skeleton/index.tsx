import React from 'react'
import { Row, Col } from 'antd'

import styles from '@styles/sass/page/home.module.scss'

import { generateNumList } from '@scripts/utils'
import { STYLE_TEXT_ROW } from '@scripts/constant'

import { BegetReactPlaceholder, SkeletonCardTitle } from '@components/common'

const { sales_front_wrapper } = styles

const skeletonLength = generateNumList(6)
export const SkeletonRankAnalyze = () => {
  return (
    <>
      <BegetReactPlaceholder
        type="textRow"
        style={{
          height: 18,
          width: 160,
          margin: 'auto'
        }}
      />
      {skeletonLength.map(num => (
        <BegetReactPlaceholder
          key={num}
          type="textRow"
          style={STYLE_TEXT_ROW}
        />
      ))}
      <div
        style={{
          height: 2
        }}
      />
    </>
  )
  /* return (
    <BegetContentLoader height={159}>
      <rect x="165" y="10" height="10" width="70"></rect>
      {skeletonLength.map(num => (
        <rect
          key={num}
          x="8.5"
          y={30 + num * 26}
          height="18"
          width="383"
        ></rect>
      ))}
    </BegetContentLoader>
  ); */
}

export const SkeletonSalesTrend = () => {
  return (
    <>
      <BegetReactPlaceholder
        type="textRow"
        style={{
          width: 360,
          height: 18,
          margin: 'auto'
        }}
      />
      <BegetReactPlaceholder
        type="rect"
        style={{
          width: 380,
          height: 372,
          margin: '26px auto 0'
        }}
      />
    </>
  )
}

const skeletonSalesRankLength = generateNumList(5)
export const SkeletonSalesRank = () => {
  return (
    <>
      <BegetReactPlaceholder
        type="textRow"
        style={{
          width: 450,
          height: 35,
          marginTop: 0
        }}
      />
      {skeletonSalesRankLength.map(num => (
        <BegetReactPlaceholder
          key={num}
          type="textRow"
          style={STYLE_TEXT_ROW}
        />
      ))}
      <div className="tr">
        <BegetReactPlaceholder
          type="textRow"
          style={{
            display: 'inline-block',
            width: 200,
            height: 33,
            marginTop: 13
          }}
        />
      </div>
    </>
  )
}

export const SkeletonGuestAreaMap = () => {
  return (
    <BegetReactPlaceholder
      type="rect"
      style={{
        height: 416
      }}
    />
  )
}

const skeletonLikeProductLength = generateNumList(5)
export const SkeletonLikeProductList = () => {
  return (
    <>
      <SkeletonCardTitle />
      {skeletonLikeProductLength.map(num => (
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

const skeletonCommentListLength = generateNumList(4)
export const SkeletonCommentList = () => {
  const data = skeletonCommentListLength.map(() => {
    return {
      avatar: (
        <BegetReactPlaceholder
          type="round"
          style={{
            width: 50,
            height: 50
          }}
        />
      ),
      datetime: (
        <BegetReactPlaceholder
          type="textRow"
          style={{
            width: 75,
            height: 18,
            marginTop: 0
          }}
        />
      ),
      content: (
        <BegetReactPlaceholder
          type="textRow"
          style={{
            height: 35
          }}
        />
      )
    }
  })
  return (
    <>
      <SkeletonCardTitle
        style={{
          marginBottom: 2.82
        }}
      />
      <ul>
        {data.map((item, key) => {
          const { avatar, datetime, content } = item
          return (
            <li
              style={{
                padding: '16.5px 0'
              }}
              layout-align="start center"
              key={key}
            >
              {avatar}
              <div
                style={{
                  marginLeft: 12
                }}
                layout-flex="1"
              >
                {datetime}
                <div>{content}</div>
              </div>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export const SkeletonProductBuyList = () => {
  return (
    <BegetReactPlaceholder
      type="rect"
      style={{
        height: 416
      }}
    />
  )
}

export const SkeletonSalesReport = () => {
  return (
    <>
      <BegetReactPlaceholder
        type="textRow"
        style={{
          height: 138,
          margin: 'auto'
        }}
      />
      <BegetReactPlaceholder
        type="textRow"
        style={{
          height: 138,
          marginTop: 2
        }}
      />
      <Row
        className={`tc ${sales_front_wrapper}`}
        type="flex"
        justify="space-between"
        align="middle"
      >
        {generateNumList(3).map((_, key) => (
          <Col
            style={{
              padding: 0
            }}
            className="sales-front-item"
            key={key}
            xs={8}
          >
            <BegetReactPlaceholder
              type="textRow"
              style={{
                height: 136,
                margin: 'auto'
              }}
            />
          </Col>
        ))}
      </Row>
    </>
  )
}
