import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { Col, Comment, Tooltip, List } from 'antd'
import { isArray } from 'util'

import { ICardChildProps } from '@scripts/types'

import styles from '@styles/sass/page/home.module.scss'

import { getCommentList } from '@scripts/servers'

import { LikeProductList } from '@components/graph'
import {
  CardHeadTitle,
  CardItemContainer,
  CoverWaitContent
} from '@components/common'
import { SkeletonCommentList } from '@components/skeleton'
import { useFetchStage } from '@components/hooks'

const { comment_content } = styles

// 首页使用此骨架屏打包出来文件太大
// const skeletonCommentListLength = generateNumList(4)
// const SkeletonCommentList = () => {
//   const data = skeletonCommentListLength.map(() => {
//     return {
//       avatar: (
//         <BegetReactPlaceholder
//           type="round"
//           style={{
//             width: 50,
//             height: 50
//           }}
//         />
//       ),
//       datetime: (
//         <BegetReactPlaceholder
//           type="textRow"
//           style={{
//             width: 75,
//             height: 18,
//             marginTop: 0
//           }}
//         />
//       ),
//       content: (
//         <BegetReactPlaceholder
//           type="textRow"
//           style={{
//             height: 35
//           }}
//         />
//       )
//     }
//   })
//   return (
//     <>
//       <SkeletonCardTitle
//         style={{
//           marginBottom: 2
//         }}
//       />
//       {
//         <List
//           className={comment_content}
//           itemLayout="horizontal"
//           dataSource={data}
//           renderItem={item => {
//             const { avatar, datetime, content } = item
//             return (
//               <li>
//                 <Comment {...{ avatar, datetime, content }} />
//               </li>
//             )
//           }}
//         />
//       }
//     </>
//   )
// }

interface ICommentLikeProductProps {}
const CommentList: React.FC<ICardChildProps> = ({ title }) => {
  const { loading, hideLoading } = useFetchStage()
  const [data, setData] = useState([])
  useEffect(() => {
    getCommentList().then(res => {
      if (isArray(res)) {
        res = res.map(v => {
          const { formNow, content, datetime } = v
          v.avatar = (
            <img
              style={{
                width: 50,
                height: 50
              }}
              src={v.avatar}
            />
          )
          v.content = <p>{content}</p>
          v.datetime = (
            <Tooltip title={moment(datetime).format('YYYY-MM-DD HH:mm:ss')}>
              <span>{formNow}</span>
            </Tooltip>
          )
          return v
        })
        setData(res)
        hideLoading()
      }
    })
  }, [])
  return (
    <CoverWaitContent
      loading={loading}
      loadingPlaceholder={<SkeletonCommentList />}
    >
      {title}
      <List
        className={comment_content}
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => {
          const { avatar, datetime, content } = item
          return (
            <li>
              <Comment {...{ avatar, datetime, content }} />
            </li>
          )
        }}
      />
    </CoverWaitContent>
  )
}

const CommentLikeProduct: React.FC<ICommentLikeProductProps> = () => {
  return (
    <>
      <Col sm={24} xl={8}>
        <CardItemContainer>
          <CommentList
            title={<CardHeadTitle text="评论" icon="message" color="#2caa6d" />}
          />
        </CardItemContainer>
      </Col>
      <Col sm={24} xl={16}>
        <CardItemContainer>
          <LikeProductList
            title={
              <CardHeadTitle
                text="热销产品排行"
                icon="ordered-list"
                color="#d479f2"
              />
            }
          />
        </CardItemContainer>
      </Col>
    </>
  )
}

export default CommentLikeProduct
