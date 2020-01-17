import React, {
  useState,
  useMemo,
  ReactElement,
  useCallback,
  useEffect,
  lazy
} from 'react'
import { Icon, Layout, Popover, Drawer, Menu, Empty, Cascader } from 'antd'
import ReactMarkdown from 'react-markdown'
import ContentLoader, { IContentLoaderProps } from 'react-content-loader'
import ReactPlaceholder from 'react-placeholder'
import { isNumber, isString, isUndefined } from 'util'

import 'react-placeholder/lib/reactPlaceholder.css'
import styTheme from '@styles/sass/shared/theme.module.scss'

import { SyntaxHighlighterProps } from 'react-syntax-highlighter'
import { PopoverProps } from 'antd/lib/popover'
import { MenuProps } from 'antd/lib/menu'
import { SiderProps } from 'antd/lib/layout/Sider'
import { CascaderOptionType } from 'antd/lib/cascader'
import { DrawerProps } from 'antd/lib/drawer'
import { TReactPlaceholderProps } from '@scripts/types'
// import { Props } from "react-placeholder/lib/ReactPlaceholder";

import { asyncLoadAreaFile } from '@store/mock'
import { isMobile } from '@scripts/helper'
import { replaceDoubleQuotes, configInfo } from '@scripts/utils'
import {
  SKELETON_DEFAULT_COLOR,
  HOME_CARD_PADDING,
  DEFAULT_THEME,
  DARK_THEME
} from '@scripts/constant'

import { ThemeContext } from '@components/context'
import { useTheme } from '@components/hooks'
import TipsWrapContent from './TipsWrapContent'
import LoadPage from './LoadPage'
import LazyRenderCompt from './LazyRenderCompt'

const { Sider } = Layout
const LazyMarkdownCodeHighlight = lazy(() => import('./MarkdownCodeHighlight'))

export const MarkdownCodeHighlight: React.SFC<SyntaxHighlighterProps> = props => (
  <LazyRenderCompt>
    <LazyMarkdownCodeHighlight {...props} />
  </LazyRenderCompt>
)

interface ICardHeadTitleProps {
  color?: string
  text?: string
  icon?: string
}
export const CardHeadTitle: React.FC<ICardHeadTitleProps> = ({
  color,
  icon,
  text = ''
}) => {
  return (
    <h3
      className="title font-size-md"
      {...(color && {
        style: {
          color
        }
      })}
    >
      {icon && <Icon type={icon} />}
      {text}
    </h3>
  )
}

export const CardItemContainer: React.FC<{
  style?: React.CSSProperties
}> = ({ children, style }) => {
  return (
    <div
      className="bg-color-white item-card"
      style={{ padding: HOME_CARD_PADDING, ...style }}
    >
      {children}
    </div>
  )
}

export interface ISvgIconProps extends React.SVGProps<SVGSVGElement> {
  component: React.ComponentType<any>
  width?: string | number
  height?: string | number
}
export const SvgIcon: React.FC<ISvgIconProps> = ({
  width = '1em',
  height = '1em',
  component: SvgComponent
}) => {
  width = isNumber(width) ? `${width}em` : width
  height = isNumber(height) ? `${height}em` : height
  return <SvgComponent {...{ width, height }} />
}

export const themesSkin = (() => {
  if (isString(styTheme.themeType)) {
    const themeList = styTheme.themeType.split(',')
    return themeList.reduce((skin, item) => {
      if (isString(item)) {
        const [type, color] = item.split(' ').filter(Boolean)
        skin = {
          ...skin,
          [replaceDoubleQuotes(type)]: color
        }
      }
      return skin
    }, {})
  }
  return {}
})()

export const ThemeProvider: React.FC = ({ children }) => {
  const [theme, switchTheme] = useState<TThemeField>(
    configInfo.theme || DEFAULT_THEME
  )
  const value = useMemo(() => ({ theme, switchTheme }), [theme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const BegetThemeContainer: React.FC<{
  children: ReactElement | null
  showThemeColor?: boolean
  showThemeBgColor?: boolean
}> = ({ children, showThemeColor, showThemeBgColor }) => {
  const { theme } = useTheme()
  const themeColor = styTheme[`theme_color_${theme}`]
  const themeBgColor = styTheme[`theme_bgcolor_${theme}`]
  if (
    React.isValidElement<{
      className: string
      style: React.CSSProperties
    }>(children)
  ) {
    const { className } = children.props
    return React.cloneElement(children, {
      className: `${className ? `${className}` : ''}${
        showThemeColor ? ` ${themeColor} ` : ''
      }${showThemeBgColor ? ` ${themeBgColor}` : ''}`
    })
  }
  return children
}

export const BegetDrawer: React.FC<DrawerProps> = ({
  children,
  className = '',
  ...reset
}) => {
  const { theme } = useTheme()
  return (
    <Drawer
      {...reset}
      className={`${styTheme[`theme_drawer_${theme}`]} ${className}`}
    >
      {children}
    </Drawer>
  )
}

export const BegetMenu: React.FC<MenuProps> = ({ children, ...reset }) => {
  const { theme } = useTheme()
  // const isLightTheme = Object.is(theme, 'light')
  return (
    <div className={styTheme[`theme_menu_${theme}`]}>
      {/* <Menu {...reset} theme={isLightTheme ? 'light' : DARK_THEME}> */}
      <Menu
        {...reset}
        {...(Object.is(DARK_THEME, theme) && { theme: DARK_THEME })}
      >
        {children}
      </Menu>
    </div>
  )
}

export const BegetSider: React.FC<SiderProps> = ({
  children,
  className = '',
  ...reset
}) => {
  const { theme } = useTheme()
  return (
    <Sider
      className={`${styTheme[`theme_sider_${theme}`]} ${className}`}
      {...reset}
    >
      {children}
    </Sider>
  )
}

export const BegetPopover: React.FC<PopoverProps> = ({
  children,
  overlayClassName = '',
  ...reset
}) => {
  const { theme } = useTheme()
  const popover_menu_theme = styTheme[`popover_menu_${theme}`]
  return (
    <Popover
      trigger={isMobile() ? 'click' : 'hover'}
      overlayClassName={`${popover_menu_theme}${
        overlayClassName ? ` ${overlayClassName}` : ''
      }`}
      placement="bottom"
      {...reset}
    >
      {children}
    </Popover>
  )
}

export const BegetCascader: React.ForwardRefExoticComponent<{
  // onChange?: (value: string[]) => void
  style?: React.CSSProperties
  className?: string
  isSync?: boolean
  placeholder?: string
  changeOnSelect?: boolean
}> = React.forwardRef((props, _) => {
  const { isSync = false, placeholder = '请选择地址', ...rest } = props
  const [info, setInfo] = useState<{
    options: CascaderOptionType[]
    loading: boolean
  }>({
    options: [],
    loading: false
  })
  const { loading, options } = info
  const onPopupVisibleChange = useCallback(
    (popupVisible: boolean) => {
      if (popupVisible && !options.length) {
        setInfo(v => ({ ...v, loading: true }))
        asyncLoadAreaFile()
          .then(res => {
            setInfo(v => ({ ...v, options: res }))
          })
          .finally(() => {
            setInfo(v => ({ ...v, loading: false }))
          })
      }
    },
    [options]
  )
  useEffect(() => {
    isSync && onPopupVisibleChange(true)
  }, [])
  return (
    <Cascader
      {...(options.length && {
        //如果不判断会出现 "ANT_CASCADER_NOT_FOUND" 占位的问题
        fieldNames: { label: 'name', value: 'name', children: 'items' }
      })}
      options={options}
      onPopupVisibleChange={onPopupVisibleChange}
      placeholder={placeholder}
      notFoundContent={
        loading ? (
          <LoadPage className="tc" />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )
      }
      {...rest}
    />
  )
})

export const PkgExampleDesc: React.FC<{
  markdownInput?: string
  name?: string
  url?: string
}> = ({ markdownInput = '', url, name = '' }) => {
  return (
    <>
      {name && (
        <h3>
          参考：
          {url ? (
            <a rel="noreferrer noopener" href={url} target="_blank">
              {name}
            </a>
          ) : (
            name
          )}
        </h3>
      )}
      {markdownInput && (
        <ReactMarkdown
          source={markdownInput}
          renderers={{
            code: MarkdownCodeHighlight
          }}
        />
      )}
    </>
  )
}

//ref:https://github.com/danilowoz/react-content-loader
export const BegetContentLoader: React.FC<IContentLoaderProps> = ({
  children,
  ...rest
}) => <ContentLoader {...rest}>{children}</ContentLoader>

//ref:https://github.com/buildo/react-placeholder
export const BegetReactPlaceholder: React.FC<TReactPlaceholderProps> = ({
  children,
  showLoadingAnimation = true,
  color = SKELETON_DEFAULT_COLOR,
  customPlaceholder,
  type,
  rows,
  style,
  ...rest
}) => {
  if (!Object.is(type, 'round')) {
    style = {
      ...style,
      maxWidth: '100%'
    }
  }
  return (
    <ReactPlaceholder
      ready={false}
      {...(isUndefined(customPlaceholder)
        ? {
            showLoadingAnimation,
            color,
            type,
            rows
          }
        : {
            customPlaceholder
          })}
      style={style}
      {...rest}
    >
      {children || <></>}
    </ReactPlaceholder>
  )
}

export const CoverWaitContent: React.FC<{
  loading?: boolean
  error?: boolean
  loadingPlaceholder?: React.ReactNode
  errorPlaceholder?: React.ReactNode
}> = ({
  loading = true,
  error = false,
  loadingPlaceholder = <LoadPage />,
  errorPlaceholder = null,
  children
}) => {
  if (loading) {
    return <>{loadingPlaceholder}</>
  }
  return error ? (
    <TipsWrapContent>{errorPlaceholder}</TipsWrapContent>
  ) : (
    <>{children}</>
  )
}

export const SkeletonCardTitle: React.FC<{
  style?: React.CSSProperties
}> = ({ style = {} }) => {
  return (
    <BegetReactPlaceholder
      type="textRow"
      style={{
        height: 30,
        marginTop: 0,
        ...style
      }}
    />
  )
}
export * from './BegetModal'
