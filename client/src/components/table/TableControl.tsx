import React, { useCallback, useState, useEffect } from 'react'
import { Table, Icon } from 'antd'

import { TableProps } from 'antd/lib/table/interface'

import { PAGE_INDEX, PAGE_SIZE } from '@scripts/constant'
import { isValidArray } from '@scripts/utils'
import { usePrevious } from '@components/hooks'
import { isUndefined } from 'util'

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />

interface IPageParames {
  pageIndex?: number
  pageSize?: number
  pageTotal?: number
  data?: any[]
}

interface ITableControlProps extends TableProps<{}> {
  info?: IPageParames
  fetchData?: (opt?: IBeforeFetchOptionProps) => void
  isCustomPagination?: boolean //前端分页
  isResetPagination?: boolean
}

interface ITableControlState {
  current: number
  total: number
  loading: boolean
  isResetPagination?: boolean
}

const getPaginationParams = (value?: IPageParames) => {
  const {
    pageIndex = PAGE_INDEX,
    pageSize = PAGE_SIZE,
    pageTotal = 1,
    data = []
  } = value || {}
  return {
    pageIndex,
    pageSize,
    pageTotal,
    data
  }
}

const TableControl: React.FC<ITableControlProps> = ({
  pagination,
  info,
  fetchData,
  children,
  isCustomPagination,
  isResetPagination,
  ...reset
}) => {
  const { pageIndex, pageSize, pageTotal, data } = getPaginationParams(info)
  const [pageData, setPageData] = useState<ITableControlState>(() => {
    return {
      current: pageIndex,
      total: pageSize * pageTotal,
      loading: false,
      isResetPagination: false
    }
  })
  const { current, total, loading } = pageData
  const handlePageChange = useCallback(
    (page: number) => {
      if (Object.is(page, current)) return //过滤数据也会出发
      if (isCustomPagination) {
        return setPageData(v => ({ ...v, current: page }))
      }
      setPageData(v => ({ ...v, current: page, loading: true }))
      fetchData &&
        fetchData({
          pageIndex: page,
          callback: () => {
            setPageData(v => ({ ...v, loading: false }))
          }
        })
    },
    [isCustomPagination, fetchData, current]
  )
  const prevState = usePrevious(pageData)
  useEffect(() => {
    if (!prevState) return
    const total: number = pageSize * pageTotal
    const isNoEqual =
      !Object.is(prevState.total, total) ||
      !Object.is(prevState.current, pageIndex)
    if (
      isCustomPagination
        ? !Object.is(isResetPagination, prevState.isResetPagination)
        : isNoEqual
    ) {
      setPageData(v => ({
        ...v,
        total,
        current: pageIndex,
        isResetPagination
      }))
    }
  }, [info, prevState, isCustomPagination, isResetPagination])
  const hasLenData = isValidArray(data)
  return (
    <Table
      bordered
      loading={{
        spinning: loading,
        indicator: antIcon
      }}
      size="small"
      pagination={
        isUndefined(pagination)
          ? (isCustomPagination || hasLenData) && {
              current,
              onChange: handlePageChange,
              ...(hasLenData && {
                pageSize,
                total
              })
            }
          : pagination
      }
      {...reset}
    >
      {children}
    </Table>
  )
}

export default TableControl
