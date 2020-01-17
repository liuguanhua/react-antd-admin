import React, { lazy } from 'react'
import { Row } from 'antd'

import HeadGridStats from './components/HeadGridStats'
import { LazyRenderCompt } from '@components/common'

const RankAnalyze = lazy(() => import('./components/RankAnalyze'))
const SalesRank = lazy(() => import('./components/SalesRank'))
const CommentLikeProduct = lazy(() => import('./components/CommentLikeProduct'))
const ProductBuyRecord = lazy(() => import('./components/ProductBuyRecord'))

export default function Index() {
  return (
    <Row gutter={24}>
      <HeadGridStats />
      <LazyRenderCompt>
        <RankAnalyze />
      </LazyRenderCompt>
      <LazyRenderCompt>
        <SalesRank />
      </LazyRenderCompt>
      <LazyRenderCompt>
        <CommentLikeProduct />
      </LazyRenderCompt>
      <LazyRenderCompt>
        <ProductBuyRecord />
      </LazyRenderCompt>
    </Row>
  )
}
