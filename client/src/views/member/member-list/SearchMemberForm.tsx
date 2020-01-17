import React, { useCallback } from 'react'
import { Form, Input, Button, DatePicker } from 'antd'

import { FormComponentProps } from 'antd/lib/form'

import { RANGE_DATE } from '@scripts/constant'
import { changeFieldsValue } from '@scripts/utils'

import { BegetCascader } from '@components/common'

export interface ISearchMemberFormProps {
  onSearch?: (values: IKeyStringProps) => void
}

const FormItem = Form.Item
const { RangePicker } = DatePicker

const SearchMemberForm: React.FC<
  FormComponentProps & ISearchMemberFormProps
> = ({ form, onSearch, children }) => {
  const { getFieldDecorator, resetFields, validateFields } = form
  const handleSubmit = useCallback(() => {
    validateFields((_, values) => {
      const { name, address, startTime, endTime } = changeFieldsValue(values)
      onSearch && onSearch({ name, address, startTime, endTime })
    })
  }, [])
  return (
    <Form layout="inline">
      <FormItem label="会员名称">
        {getFieldDecorator('name')(
          <Input allowClear placeholder="请输入会员名称" />
        )}
      </FormItem>
      <FormItem label="注册时间">
        {getFieldDecorator(RANGE_DATE)(<RangePicker />)}
      </FormItem>
      <FormItem label="地址">
        {getFieldDecorator('address')(
          <BegetCascader
            changeOnSelect
            style={{
              width: 250
            }}
          />
        )}
      </FormItem>
      <FormItem>
        <Button
          className="mgr"
          type="primary"
          icon="search"
          onClick={handleSubmit}
        >
          搜索
        </Button>
        <Button
          icon="rest"
          onClick={() => {
            resetFields()
            handleSubmit()
          }}
        >
          重置
        </Button>
        {children}
      </FormItem>
    </Form>
  )
}

export default SearchMemberForm
