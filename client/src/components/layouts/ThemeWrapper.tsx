import React, { useCallback } from 'react'
import { Icon, Switch, Select } from 'antd'
import { connect } from 'dva'
import classNames from 'classnames'

import { DispatchProp } from 'react-redux'

import styTheme from '@styles/sass/shared/theme.module.scss'

import { setStorage } from '@scripts/utils'
import { WEB_CONFIG, MARKDOWN_CODE_THEME } from '@scripts/constant'

import { useTheme, useModal } from '@components/hooks'
import {
  themesSkin,
  BegetDrawer,
  BegetThemeContainer
} from '@components/common'

const { Option } = Select

const { theme_list } = styTheme
const SETTING_TEXT = '设置'
const themeKeys = Object.keys(themesSkin)

const CodeMarkdownTheme: React.SFC<{
  configInfo?: IConfigInfoProps
} & DispatchProp> = ({ configInfo = {}, dispatch }) => {
  const { showLineNumbers, codeTheme } = configInfo
  const updateConfigInfo = useCallback(
    info => {
      dispatch({
        type: 'global/upState',
        data: {
          configInfo: {
            ...configInfo,
            ...info
          }
        }
      })
      setStorage(WEB_CONFIG, info)
    },
    [configInfo]
  )

  return (
    <>
      <BegetThemeContainer showThemeColor>
        <h3>markdown主题</h3>
      </BegetThemeContainer>
      <span className="mgr">
        <Switch
          onChange={() => {
            updateConfigInfo({ showLineNumbers: !showLineNumbers })
          }}
          checked={showLineNumbers}
          checkedChildren="行号(关)"
          unCheckedChildren="行号(开)"
        />
      </span>
      <Select
        style={{
          width: 118
        }}
        value={codeTheme}
        onChange={styTheme => {
          updateConfigInfo({ codeTheme: styTheme })
        }}
      >
        {MARKDOWN_CODE_THEME.map(styTheme => (
          <Option value={styTheme} key={styTheme}>
            {styTheme}
          </Option>
        ))}
      </Select>
    </>
  )
}

type IThemeWrapperProps = ISharedProps &
  DispatchProp & {
    onSetting?: () => void
  }

const ThemeWrapper: React.FC<IThemeWrapperProps> = ({
  onSetting,
  dispatch,
  configInfo = {}
}) => {
  const { isFixedHeader, isFixedSider } = configInfo
  const { theme, switchTheme } = useTheme()
  const [isShow, { showModal, hideModal }] = useModal()
  const swapTheme = useCallback((status: string) => {
    switchTheme(status)
    setStorage(WEB_CONFIG, {
      theme: status
    })
  }, [])
  const handleSetting = useCallback(() => {
    onSetting && onSetting()
    showModal()
  }, [])

  const onChange = useCallback(
    key => {
      return checked => {
        const info = {
          [key]: checked
        }
        dispatch({
          type: 'global/upState',
          data: {
            configInfo: {
              ...configInfo,
              ...info
            }
          }
        })
        setStorage(WEB_CONFIG, info)
      }
    },
    [configInfo]
  )

  return (
    <>
      <Icon
        title={SETTING_TEXT}
        onClick={handleSetting}
        className="cursign"
        type="setting"
      />
      <BegetDrawer
        title={
          <BegetThemeContainer showThemeColor>
            <span>设置</span>
          </BegetThemeContainer>
        }
        onClose={hideModal}
        visible={isShow}
        placement="right"
      >
        <BegetThemeContainer showThemeColor>
          <h3>背景色</h3>
        </BegetThemeContainer>
        <ul layout-align="space-between center" className={`${theme_list} mgb`}>
          {themeKeys.map(item => {
            const color = themesSkin[item]
            const isActive = Object.is(theme, item)
            return (
              <li
                style={{
                  backgroundColor: color
                }}
                onClick={() => {
                  swapTheme(item)
                }}
                className={classNames({
                  active: isActive
                })}
                key={item}
              >
                <Icon className="theme-check" type="check" />
              </li>
            )
          })}
        </ul>
        <BegetThemeContainer showThemeColor>
          <h3>页面设置</h3>
        </BegetThemeContainer>
        <div layout-align="space-between center">
          <Switch
            unCheckedChildren="固定头部(开)"
            checkedChildren="固定头部(关)"
            checked={isFixedHeader}
            onChange={onChange('isFixedHeader')}
          />
          <Switch
            unCheckedChildren="固定菜单(开)"
            checkedChildren="固定菜单(关)"
            checked={isFixedSider}
            onChange={onChange('isFixedSider')}
          />
        </div>
        <CodeMarkdownTheme dispatch={dispatch} configInfo={configInfo} />
      </BegetDrawer>
    </>
  )
}

export default connect(({ global }) => global)(ThemeWrapper)
