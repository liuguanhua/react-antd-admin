import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'dva'
import {
  Prism as SyntaxHighlighter,
  SyntaxHighlighterProps
} from 'react-syntax-highlighter'

import 'react-placeholder/lib/reactPlaceholder.css'

import { toHorizontalLine, setStorage } from '@scripts/utils'
import { DispatchProp } from 'react-redux'
import {
  DEFAULT_CODE_THEME,
  MARKDOWN_CODE_THEME,
  WEB_CONFIG
} from '@root/src/scripts/constant'

const MarkdownCodeHighlight: React.FC<SyntaxHighlighterProps &
  DispatchProp & {
    global: ISharedProps
  } & ISharedProps> = ({
  value = '',
  global: { configInfo = {} },
  dispatch,
  ...rest
}) => {
  const { showLineNumbers, codeTheme } = configInfo
  const [highlightTheme, setHighlightTheme] = useState()
  const handleChange = useCallback(
    styTheme => {
      const info = {
        codeTheme: styTheme
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
    },
    [configInfo]
  )

  useEffect(() => {
    if (MARKDOWN_CODE_THEME.includes(codeTheme || '')) {
      const themeName = toHorizontalLine(codeTheme)
      import(`react-syntax-highlighter/dist/esm/styles/prism/${themeName}`)
        .then(({ default: mod }) => {
          setHighlightTheme(mod)
        })
        .catch(() => {
          // message.warning('加载主题失败!')
        })
    } else {
      handleChange(DEFAULT_CODE_THEME)
    }
  }, [codeTheme])

  return (
    <SyntaxHighlighter
      showLineNumbers={showLineNumbers}
      style={highlightTheme}
      {...rest}
    >
      {value}
    </SyntaxHighlighter>
  )
}

export default connect(({ global }) => ({ global }))(
  MarkdownCodeHighlight
) as React.ComponentType<SyntaxHighlighterProps>
