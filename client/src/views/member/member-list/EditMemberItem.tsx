import React from 'react'
import { Form, Input, InputNumber, Radio } from 'antd'

import { FormComponentProps } from 'antd/lib/form'

import { userSexOption } from '@scripts/utils'

import { BegetCascader } from '@components/common'

interface IEditMemberItemProps {
  value: IKeyStringProps
}

const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    sm: { span: 3 }
  },
  wrapperCol: {
    sm: { span: 21 }
  }
}

const EditMemberItem: React.FC<FormComponentProps & IEditMemberItemProps> = ({
  form,
  value = {}
}) => {
  const { getFieldDecorator } = form
  const {
    name,
    nickname,
    address: transferAddress,
    sex,
    email,
    grade,
    userId
  } = value
  const address = transferAddress ? transferAddress.split(' ') : []
  return (
    <Form {...formItemLayout}>
      <FormItem label="昵称">
        {getFieldDecorator('nickname', {
          initialValue: nickname,
          rules: [
            {
              required: true,
              message: '请输入昵称!'
            }
          ]
        })(<Input maxLength={15} />)}
      </FormItem>
      <FormItem label="等级">
        {getFieldDecorator('grade', {
          initialValue: grade,
          rules: [
            {
              required: true,
              message: '请输入等级!'
            }
          ]
        })(
          <InputNumber
            style={{
              width: '100%'
            }}
            min={0}
            max={100}
            precision={0}
          />
        )}
      </FormItem>
      <FormItem label="姓名">
        {getFieldDecorator('name', {
          initialValue: name,
          rules: [
            {
              required: true,
              message: '请输入姓名!'
            }
          ]
        })(<Input maxLength={6} />)}
      </FormItem>
      <FormItem label="性别">
        {getFieldDecorator('sex', {
          initialValue: sex,
          rules: [
            {
              required: true,
              message: '请选择性别!'
            }
          ]
        })(<Radio.Group options={userSexOption} />)}
      </FormItem>
      <FormItem label="邮箱">
        {getFieldDecorator('email', {
          initialValue: email,
          rules: [
            {
              required: true,
              message: '请输入邮箱!'
            },
            {
              type: 'email',
              message: '邮箱不正确!'
            }
          ]
        })(<Input />)}
      </FormItem>
      <FormItem label="地址">
        {getFieldDecorator('address', {
          initialValue: address,
          rules: [
            {
              required: true,
              message: '请选择地址!'
            }
          ]
        })(<BegetCascader isSync className="w-100" />)}
      </FormItem>
      {userId && (
        <FormItem className="hide" label="地址">
          {getFieldDecorator('userId', {
            initialValue: userId
          })(<Input type="hidden" />)}
        </FormItem>
      )}
    </Form>
  )
}

export default EditMemberItem
