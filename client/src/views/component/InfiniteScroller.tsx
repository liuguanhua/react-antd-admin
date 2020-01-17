import React, { useCallback, useState } from 'react'
import { Row, Col, Card, Icon, BackTop } from 'antd'
import InfiniteScroll from 'react-infinite-scroller'
import Lazyload from 'react-lazyload'

import { LoadPage, TipsWrapContent } from '@root/src/components/common'
import { isValidArray } from '@root/src/scripts/utils'
import { FIXED_PAGE_SIZE } from '@root/src/scripts/constant'
import { fetchInfiniteListData } from '@root/src/scripts/servers'

const { publicPath } = window.g_config
const cardStyle: React.CSSProperties = {
  padding: 10
}

interface IInfiniteScrollerProps {}

const ListItem: React.SFC<{ values: IKeyStringProps }> = ({
  values: { content, pic, formNow, title }
}) => {
  return (
    <Col
      className="mgb"
      {...{
        sm: 12,
        lg: 8,
        xl: 6,
        xxl: 4
      }}
    >
      <Card
        className="custom-card-wrapper"
        title={title}
        hoverable
        headStyle={cardStyle}
        bodyStyle={cardStyle}
        cover={
          <Lazyload
            once
            throttle={200}
            height={400}
            placeholder={
              // <img src="https://dummyimage.com/400x400/eee/eee" alt="" />
              <img
                height={400}
                src={`${publicPath}static/placeholder-pic.png`}
                alt=""
              />
            }
          >
            <img src={pic} alt="" />
          </Lazyload>
        }
        actions={[
          <Icon type="eye" />,
          <Icon type="share-alt" />,
          <Icon type="ellipsis" key="ellipsis" />
        ]}
      >
        <span>
          <Icon className="mgr" type="clock-circle" />
          {formNow}
        </span>
        <p
          className="mgt even-line-ellipsis"
          style={{
            textIndent: '1.8em'
          }}
        >
          {content}
        </p>
      </Card>
    </Col>
  )
}

const InfiniteScroller: React.FC<IInfiniteScrollerProps> = props => {
  const [info, setInfo] = useState<IKeyStringProps>({
    data: []
  })
  const { data, pageIndex, hasNextPage = true } = info
  const fetchData = useCallback(
    (pageIndex: number = 1) => {
      fetchInfiniteListData(pageIndex)
        .then(res => {
          const { data: list } = res
          const isDefaultPage = Object.is(pageIndex, 1)
          setInfo(v => ({
            ...v,
            ...res,
            data: isDefaultPage ? list : [...data, ...list]
          }))
        })
        .catch(() => {
          setInfo(v => ({
            ...v,
            hasNextPage: false
          }))
        })
    },
    [data]
  )

  const loadFunc = useCallback(
    page => {
      if (!hasNextPage) return
      fetchData(page)
    },
    [pageIndex, hasNextPage]
  )
  return (
    <div layout-flex="auto" className="bg-color-white h-100 pd">
      {Object.is(pageIndex, 1) && !isValidArray(data) && <TipsWrapContent />}
      <InfiniteScroll
        pageStart={0}
        loadMore={loadFunc}
        hasMore={hasNextPage}
        loader={
          <LoadPage key={0} className="mgt">
            <span className="color-theme mgl">加载中...</span>
          </LoadPage>
        }
      >
        <Row gutter={16}>
          {data.map(item => (
            <ListItem values={item} key={item.id} />
          ))}
        </Row>
        {!hasNextPage &&
          isValidArray(data) &&
          data.length >= FIXED_PAGE_SIZE && (
            <div className="tc">没有更多了</div>
          )}
      </InfiniteScroll>
      <BackTop
        style={{
          right: 50
        }}
      />
    </div>
  )
}

export default InfiniteScroller
