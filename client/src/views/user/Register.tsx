import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Input, Icon, message, Row, Col } from 'antd'
import { connect } from 'dva'
import { DispatchProp } from 'react-redux'

import { FormComponentProps } from 'antd/lib/form/Form'

import styles from '@styles/sass/page/login.module.scss'

import { LOGIN, HOME } from '@scripts/routers'
import { goRegisterAccount } from '@scripts/servers'

import { useStatusDisabled } from '@components/hooks'
import FormLogo from './components'

const FormItem = Form.Item
const { login_form, btn_get_verify_code } = styles
const REGISTER_TEXT = '注册'

const Register: React.SFC<FormComponentProps & DispatchProp> = ({
  form,
  dispatch
}) => {
  const keepData = useRef({
    interval: 0
  })
  const mobileInput = React.createRef<Input>()
  const { disabled, setDisabled, cancelDisabled } = useStatusDisabled()
  const [info, setInfo] = useState({
    btnText: REGISTER_TEXT,
    countTime: 0
  })

  const { btnText, countTime } = info
  const { getFieldDecorator, validateFields, getFieldValue, setFields } = form

  useEffect(() => {
    return () => {
      clearInterval(keepData.current.interval)
    }
  }, [])

  const getVerifyCode = useCallback(() => {
    const mobileValue = getFieldValue('mobile')
    const regex = /^\d{11}$/
    if (mobileValue) {
      if (regex.test(mobileValue)) {
        sendVerifyCode()
      }
    } else {
      setFields({
        mobile: {
          value: mobileValue,
          errors: [new Error('请输入手机号码!')]
        }
      })
    }
    const { current } = mobileInput
    current?.focus()
  }, [])

  const sendVerifyCode = useCallback(() => {
    let countTime: number = 5
    const { current } = keepData
    clearInterval(current.interval)
    setInfo(v => ({ ...v, countTime }))
    current.interval = window.setInterval(() => {
      countTime--
      if (countTime < 0) {
        return clearInterval(current.interval)
      }
      setInfo(v => ({ ...v, countTime }))
    }, 1000)
  }, [])

  const handleSubmit = useCallback((e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault()
    validateFields((err, values) => {
      if (!err) {
        setDisabled()
        setInfo(v => ({
          ...v,
          btnText: `${btnText}中...`
        }))
        goRegisterAccount(values)
          .then(res => {
            dispatch({
              type: 'global/upState',
              data: {
                userInfo: res
              }
            })
            message.success(`${REGISTER_TEXT}成功!`)
            window.g_history.push(HOME)
          })
          .catch(() => {
            cancelDisabled()
            setInfo(v => ({
              ...v,
              btnText: REGISTER_TEXT
            }))
          })
      }
    })
  }, [])

  return (
    <div className={`${login_form} locate-very lr0`}>
      <FormLogo welcomeContent={REGISTER_TEXT} />
      <Form className="form-wrapper" onSubmit={handleSubmit}>
        <FormItem>
          {getFieldDecorator('mobile', {
            rules: [
              {
                required: true,
                message: `请输入手机号码!`
              },
              {
                pattern: /^\d{11}$/,
                message: '请输入正确的手机号码!'
              }
            ]
          })(
            <Input
              ref={mobileInput}
              autoFocus
              prefix={<Icon type="mobile" className="color-default-gray" />}
              suffix={<span className="color-default-gray">手机</span>}
              required
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
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
        <FormItem>
          {getFieldDecorator('confirmPassword', {
            rules: [
              {
                required: true,
                message: `请确认密码!`
              },
              {
                validator: (rule, value, callback) => {
                  return value && !Object.is(value, getFieldValue('password'))
                    ? callback('两次密码不同')
                    : callback()
                }
              }
            ]
          })(
            <Input
              type="password"
              maxLength={20}
              prefix={<Icon type="lock" className="color-default-gray" />}
              suffix={<span className="color-default-gray">确认密码</span>}
              required
            />
          )}
        </FormItem>
        <Row gutter={16}>
          <Col span={16}>
            <FormItem>
              {getFieldDecorator('verifyCode', {
                rules: [
                  {
                    required: true,
                    message: `请输入验证码!`
                  }
                ]
              })(
                <Input
                  className="input-verify-code"
                  maxLength={6}
                  prefix={<Icon type="safety" className="color-default-gray" />}
                  suffix={<span className="color-default-gray">验证码</span>}
                  required
                />
              )}
            </FormItem>
          </Col>
          <Col className="tr" span={8}>
            <Button
              className={btn_get_verify_code}
              disabled={!!countTime}
              onClick={getVerifyCode}
              style={{ marginTop: 5 }}
            >
              {countTime ? `${countTime}s后发送` : '获取验证码'}
            </Button>
          </Col>
        </Row>
        <Button
          disabled={disabled}
          className="w-100"
          type="primary"
          htmlType="submit"
        >
          {btnText}
        </Button>
        <FormItem>
          <h4 layout-align="end center">
            <Link to={LOGIN}>已有账户</Link>
          </h4>
        </FormItem>
      </Form>
    </div>
  )
}

export default connect(({ global }) => global)(Form.create()(Register))
