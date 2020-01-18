import React, { lazy } from 'react'
import { Row, Col } from 'antd'

import HeadGridStats from './components/HeadGridStats'
import { LazyRenderCompt, CardItemContainer } from '@components/common'

import {
  SkeletonRankAnalyze,
  SkeletonSalesTrend,
  SkeletonSalesRank,
  SkeletonGuestAreaMap,
  SkeletonCommentList,
  SkeletonLikeProductList,
  SkeletonProductBuyList,
  SkeletonSalesReport
} from '@components/skeleton'

const RankAnalyze = lazy(() => import('./components/RankAnalyze'))
const SalesRank = lazy(() => import('./components/SalesRank'))
const CommentLikeProduct = lazy(() => import('./components/CommentLikeProduct'))
const ProductBuyRecord = lazy(() => import('./components/ProductBuyRecord'))

export default function Index() {
  return (
    <Row gutter={24}>
      <HeadGridStats />
      <LazyRenderCompt
        fallback={
          <>
            <Col sm={24} xl={12} xxl={18}>
              <CardItemContainer>
                <SkeletonRankAnalyze />
              </CardItemContainer>
            </Col>
            <Col sm={24} xl={12} xxl={6}>
              <CardItemContainer>
                <SkeletonSalesTrend />
              </CardItemContainer>
            </Col>
          </>
        }
      >
        <RankAnalyze />
      </LazyRenderCompt>
      <LazyRenderCompt
        fallback={
          <>
            <Col sm={24} xl={12}>
              <CardItemContainer>
                <SkeletonSalesRank />
              </CardItemContainer>
            </Col>
            <Col sm={24} xl={12}>
              <CardItemContainer>
                <SkeletonGuestAreaMap />
              </CardItemContainer>
            </Col>
          </>
        }
      >
        <SalesRank />
      </LazyRenderCompt>
      <LazyRenderCompt
        fallback={
          <>
            <Col sm={24} xl={8}>
              <CardItemContainer>
                <SkeletonCommentList />
              </CardItemContainer>
            </Col>
            <Col sm={24} xl={16}>
              <CardItemContainer>
                <SkeletonLikeProductList />
              </CardItemContainer>
            </Col>
          </>
        }
      >
        <CommentLikeProduct />
      </LazyRenderCompt>
      <LazyRenderCompt
        fallback={
          <>
            <Col sm={24} xl={8}>
              <CardItemContainer>
                <SkeletonProductBuyList />
              </CardItemContainer>
            </Col>
            <Col sm={24} xl={8}>
              <CardItemContainer>
                <SkeletonProductBuyList />
              </CardItemContainer>
            </Col>
            <Col sm={24} xl={8}>
              <CardItemContainer>
                <SkeletonSalesReport />
              </CardItemContainer>
            </Col>
          </>
        }
      >
        <ProductBuyRecord />
      </LazyRenderCompt>
    </Row>
  )
}
