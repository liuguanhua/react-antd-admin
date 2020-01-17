import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Input, Icon, message } from 'antd'
import { connect } from 'dva'
import { DispatchProp } from 'react-redux'

import { FormComponentProps } from 'antd/lib/form/Form'

import styles from '@styles/sass/page/login.module.scss'

import { REGISTER, HOME } from '@scripts/routers'
import { goLoginAccount } from '@scripts/servers'

import { useStatusDisabled } from '@components/hooks'
import FormLogo from './components'

const FormItem = Form.Item
const { login_form } = styles
const LOGIN_TEXT = '登录'

const Login: React.SFC<FormComponentProps & DispatchProp> = ({
  form,
  dispatch
}) => {
  const { disabled, setDisabled, cancelDisabled } = useStatusDisabled()
  const { getFieldDecorator, validateFields } = form
  const [info, setInfo] = useState({
    btnText: LOGIN_TEXT
  })
  const { btnText } = info
  const handleSubmit = useCallback((e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault()
    validateFields((err, values) => {
      if (!err) {
        setDisabled()
        setInfo(v => ({
          ...v,
          btnText: `${btnText}中...`
        }))
        goLoginAccount(values)
          .then(res => {
            dispatch({
              type: 'global/upState',
              data: {
                userInfo: res
              }
            })
            message.success(`${LOGIN_TEXT}成功!`)
            window.g_history.push(HOME)
          })
          .catch(() => {
            cancelDisabled()
            setInfo(v => ({
              ...v,
              btnText: LOGIN_TEXT
            }))
          })
      }
    })
  }, [])
  return (
    <div className={`${login_form} locate-very lr0`}>
      <FormLogo />
      <Form className="form-wrapper" onSubmit={handleSubmit}>
        <FormItem>
          {getFieldDecorator('userName', {
            initialValue: 'admin',
            rules: [
              {
                required: true,
                message: `请输入用户名!`
              },
              {
                max: 10,
                message: `用户名不能大于10位!`
              }
            ]
          })(
            <Input
              autoFocus
              maxLength={10}
              prefix={<Icon type="user" className="color-default-gray" />}
              suffix={<span className="color-default-gray">用户名</span>}
              required
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            initialValue: 888888,
            rules: [
              {
                required: true,
                message: `请输入密码!`
              }
              // {
              //   min: 6,
              //   message: `密码不能低于6位!`
              // }
            ]
          })(
            <Input
              type="password"
              maxLength={20}
              prefix={<Icon type="lock" className="color-default-gray" />}
              suffix={<span className="color-default-gray">密码</span>}
              required
            />
          )}
        </FormItem>
        <Button
          disabled={disabled}
          className="w-100"
          type="primary"
          htmlType="submit"
        >
          {btnText}
        </Button>
        <p
          style={{
            margin: '15px 0 0'
          }}
          className="color-default-gray"
          layout-align="space-between center"
        >
          <span>账号：随意</span>
          <span>密码：随意</span>
        </p>
        <FormItem>
          <h4 layout-align="end center">
            <Link to={REGISTER}>创建账户</Link>
          </h4>
        </FormItem>
      </Form>
    </div>
  )
}

export default connect(({ global }) => global)(Form.create()(Login))
