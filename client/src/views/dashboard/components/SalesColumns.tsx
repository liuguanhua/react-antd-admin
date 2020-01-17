import React from 'react'
import { Tag } from 'antd'
import { mock } from 'mockjs'

import { TColumnType } from '@scripts/types'

import { begetColunmKey, numToThousands, generateNumList } from '@scripts/utils'

const renderSalescontent = text => numToThousands(text)

export const productSalesColumn: TColumnType = begetColunmKey([
  {
    dataIndex: 'goodsName',
    title: '商品名称'
  },
  {
    dataIndex: 'price',
    title: '单价'
  },
  {
    dataIndex: 'quantity',
    title: '数量'
  },
  {
    dataIndex: 'sales',
    title: '销售额',
    render: renderSalescontent
  }
])

export const clientBuyColumn: TColumnType = begetColunmKey([
  {
    dataIndex: 'clientName',
    title: '客户名称'
  },
  {
    dataIndex: 'orderQuantity',
    title: '订单数量'
  },
  {
    dataIndex: 'sales',
    title: '销售额',
    render: renderSalescontent
  }
])

export const areaBuyColumn: TColumnType = begetColunmKey([
  {
    dataIndex: 'areaName',
    title: '地区名称'
  },
  {
    dataIndex: 'orderQuantity',
    title: '订单数量'
  },
  {
    dataIndex: 'sales',
    title: '销售额',
    render: renderSalescontent
  }
])

export const supplierGoodsColumn: TColumnType = begetColunmKey([
  {
    dataIndex: 'supplierName',
    title: '供应商名称'
  },
  {
    dataIndex: 'type',
    title: '类别'
  },
  {
    dataIndex: 'salesVolume',
    title: '销量'
  },
  {
    dataIndex: 'sales',
    title: '销售额',
    render: renderSalescontent
  }
])

export const salesManColumn: TColumnType = begetColunmKey([
  {
    dataIndex: 'salesManName',
    title: '业务员名称'
  },
  {
    dataIndex: 'sales',
    title: '销售额',
    render: renderSalescontent
  }
])

export const tableRowRecord: { pageIndex: number } = { pageIndex: 1 }
const limitNum = 3
const color: string[] = mock(generateNumList(limitNum).map(() => '@color'))
const renderRankingContent = (text, _, index) => {
  return index <= limitNum - 1 && Object.is(tableRowRecord.pageIndex, 1) ? (
    <Tag style={{ margin: 0 }} color={color[index]}>
      {text}
    </Tag>
  ) : (
    text
  )
}

const columnsGroup = [
  productSalesColumn,
  clientBuyColumn,
  areaBuyColumn,
  supplierGoodsColumn,
  salesManColumn
].map(columns => {
  return [
    {
      dataIndex: 'ranking',
      title: '排名',
      render: renderRankingContent,
      align: 'center'
    },
    ...columns,
    {
      dataIndex: 'operate',
      title: '操作',
      width: 85,
      render: () => (
        <a href="#" onClick={e => e.preventDefault()}>
          查看详情
        </a>
      ),
      align: 'center'
    }
  ]
})

export default columnsGroup
