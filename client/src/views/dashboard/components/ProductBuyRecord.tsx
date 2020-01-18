import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Col, Icon, Menu } from 'antd'
import { isArray } from 'util'

import styles from '@styles/sass/page/home.module.scss'

import { TColumnType, ICardChildProps } from '@scripts/types'
import { EBuyRecordType, EBuyRecordColor } from '@scripts/types/EnumType'

import { begetColunmKey, numToThousands } from '@scripts/utils'
import * as homeService from '@scripts/servers'

import { TableControl } from '@components/table'
import { SalesReport } from '@components/graph'
import {
  LoadPage,
  CardHeadTitle,
  BegetPopover,
  CardItemContainer,
  CoverWaitContent,
  BegetMenu
} from '@components/common'
import { SkeletonProductBuyList } from '@components/skeleton'
import { useFetchStage } from '@components/hooks'

const { product_buy_record } = styles

interface IProductBuyRecordProps {}
const TransactionRecordColumns: TColumnType = begetColunmKey([
  {
    dataIndex: 'avatar',
    title: '用户',
    colSpan: 2,
    render(imgSrc, row: IKeyStringProps) {
      return (
        <div className="avatar-thumbnail">
          <img className="w-100 h-100" src={imgSrc} alt={row.userName} />
        </div>
      )
    }
  },
  {
    dataIndex: 'userName',
    colSpan: 0
  },
  {
    dataIndex: 'type',
    title: '类型',
    render(type) {
      return (
        <>
          <span
            className="mgr"
            {...(EBuyRecordColor[type] && {
              style: {
                color: EBuyRecordColor[type]
              }
            })}
          >
            &#9679;
          </span>
          {EBuyRecordType[type] || ''}
        </>
      )
    }
  },
  // {
  //   dataIndex: 'device',
  //   title: '设备'
  // },
  {
    dataIndex: 'datetime',
    title: '日期'
  }
])

const LIMIT_QUANTITY = 80 //剩余数量临界点
const begetStyleHighlight = (flag: boolean = false) => ({
  color: flag ? '#46ce4c' : '#ff363c'
})
const productBuyColumns: TColumnType = begetColunmKey([
  {
    dataIndex: 'productImage',
    title: '商品描述',
    colSpan: 2,
    render(imgSrc, row: IKeyStringProps) {
      return (
        <div className="avatar-thumbnail">
          <img className="w-100 h-100" src={imgSrc} alt={row.productName} />
        </div>
      )
    }
  },
  {
    dataIndex: 'productName',
    colSpan: 0,
    render(productName, record: IKeyStringProps) {
      const { lastQuantity } = record
      const flag = lastQuantity > LIMIT_QUANTITY
      const sty_highlight = begetStyleHighlight(flag)
      return (
        <div className="tc">
          <p
            style={{
              lineHeight: 1,
              width: '99.99%'
            }}
            className="tc reset-margin ellipsis"
          >
            {productName}
          </p>
          <span className="font-size-xxs" style={sty_highlight}>
            &#9679;
            <span className="mgl">
              {flag ? '有现货' : `剩余${lastQuantity}个`}
            </span>
          </span>
        </div>
      )
    }
  },
  {
    dataIndex: 'quantity',
    title: '销售数量',
    render: text => numToThousands(text)
  },
  {
    dataIndex: 'isIncrease',
    title: '趋势',
    render(isIncrease, record: IKeyStringProps) {
      const { trend } = record
      const sty_highlight = begetStyleHighlight(isIncrease)
      return (
        <span>
          <span className="mgr" style={sty_highlight}>
            <Icon type={`arrow-${isIncrease ? 'up' : 'down'}`} />
          </span>
          比上周&nbsp;
          <span style={sty_highlight}>
            {isIncrease ? '增加' : '下降'}
            {trend}%
          </span>
        </span>
      )
    }
  },
  {
    dataIndex: 'operate',
    title: '操作',
    width: 60,
    render() {
      return (
        <BegetPopover
          overlayClassName="custom-menu-popover"
          placement="bottom"
          content={
            <BegetMenu style={{ width: 100 }} mode="inline">
              <Menu.Item>操作一</Menu.Item>
              <Menu.Item>操作二</Menu.Item>
              <Menu.Item>操作三</Menu.Item>
            </BegetMenu>
          }
        >
          <Icon className="font-size-xxl cursign" type="ellipsis" />
        </BegetPopover>
      )
    }
  }
])

interface IProductBuyListProps extends ICardChildProps {
  columns?: TColumnType
  moreText?: string
  fetchMethod?: string
}

const ProductBuyList: React.FC<IProductBuyListProps> = ({
  columns = TransactionRecordColumns,
  moreText = '交易记录',
  fetchMethod = 'getPactRecord',
  title
}) => {
  const keepData = useRef({
    isFirstLoad: true
  })
  const { loading, hideLoading } = useFetchStage()
  const [info, setInfo] = useState<{
    data: TSetKeyStringProps
    pageTotal: number
    pageIndex: number
    isLoading: boolean
  }>({
    data: [],
    pageTotal: 1,
    pageIndex: 0,
    isLoading: false
  })
  const { data, pageTotal, pageIndex, isLoading } = info
  const fetchData = useCallback(
    (pIndex: number = 1) => {
      if (!homeService[fetchMethod]) return
      setInfo(v => ({ ...v, isLoading: true }))
      homeService[fetchMethod](pIndex)
        .then(res => {
          if (!isArray(res.data)) return
          setInfo(v => {
            res.data = res.data.map((r, index) => {
              r.key = v.data.length + index
              return r
            })
            v.data = [...v.data, ...res.data]
            return {
              ...v,
              ...res,
              data: v.data
            }
          })
          const { current } = keepData
          if (current.isFirstLoad) {
            current.isFirstLoad = false
            hideLoading()
          }
        })
        .finally(() => {
          setInfo(v => ({ ...v, isLoading: false }))
        })
    },
    [fetchMethod]
  )
  useEffect(() => {
    fetchData()
  }, [fetchData])
  return (
    <CoverWaitContent
      loading={loading}
      loadingPlaceholder={<SkeletonProductBuyList />}
    >
      {title}
      <TableControl
        className={product_buy_record}
        footer={() => {
          if (isLoading) {
            return (
              <div className="tc">
                <LoadPage />
              </div>
            )
          }
          return (
            <div className="tc">
              {pageIndex ? (
                pageTotal > pageIndex ? (
                  <span
                    onClick={() => {
                      fetchData(pageIndex + 1)
                    }}
                    className="color-theme cursign"
                  >
                    <Icon type="down" /> 查看更多
                    {moreText}
                  </span>
                ) : (
                  <span>没有更多了～</span>
                )
              ) : null}
            </div>
          )
        }}
        columns={columns}
        dataSource={data}
      />
    </CoverWaitContent>
  )
}

const ProductBuyRecord: React.FC<IProductBuyRecordProps> = () => {
  return (
    <>
      <Col sm={24} xl={12} xxl={8}>
        <CardItemContainer>
          <ProductBuyList
            title={
              <CardHeadTitle text="用户交易记录" icon="shop" color="#2e385e" />
            }
          />
        </CardItemContainer>
      </Col>
      <Col sm={24} xl={12} xxl={8}>
        <CardItemContainer>
          <ProductBuyList
            fetchMethod="getBuyProductList"
            columns={productBuyColumns}
            moreText="产品"
            title={
              <CardHeadTitle
                text="产品购买趋势"
                icon="shopping-cart"
                color="#ccac2d"
              />
            }
          />
        </CardItemContainer>
      </Col>
      <Col sm={24} xl={24} xxl={8}>
        <CardItemContainer>
          <SalesReport
            title={
              <CardHeadTitle text="销售报告" icon="dot-chart" color="#2ca6a6" />
            }
          />
        </CardItemContainer>
      </Col>
    </>
  )
}

export default ProductBuyRecord
