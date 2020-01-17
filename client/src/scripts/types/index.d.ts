import React, { Dispatch, SetStateAction } from 'react'
import { ColumnProps } from 'antd/lib/table/interface'

type TColumnType = ColumnProps<{}>[]

interface IwindowWH {
  width: number
  height: number
}

interface IFrameConfigProps {}

interface IFrameProps<T = {}> extends IFrameConfigProps {
  wrapComponent: React.FC<T>
}

interface IComponentFrame {
  Password: IFrameProps
  Default: IFrameProps
}

type TComponentKey = keyof IComponentFrame

interface IUrlParamsType {
  apiKey: string
  route?: string
}

type TFetchUrlType = IUrlParamsType | string

type TSetStateAction = Dispatch<SetStateAction>

interface INoticeNumProps {
  totalStarNum: number
  totalUnreadNum: number
  totalNoticeNum: number
  lastTotalUnreadNum: number //剩余页统计未读的数量
  lastTotalStarNum: number //剩余页统计已加星标的数量
}

type CommonProps = {
  children?: React.ReactNode
  /** pass `true` when the content is ready and `false` when it's loading */
  ready?: boolean
  /** delay in millis to wait when passing from ready to NOT ready */
  delay?: number
  /** if true, the placeholder will never be rendered again once ready becomes true, even if it becomes false again */
  firstLaunchOnly?: boolean
  className?: string
  style?: React.CSSProperties
}
type TReactPlaceholderProps =
  | (CommonProps & {
      /** type of placeholder to use */
      type: 'text' | 'media' | 'textRow' | 'rect' | 'round'
      /** number of rows displayed in 'media' and 'text' placeholders */
      rows?: number
      /** color of the placeholder */
      color?: string
      /** pass true to show a nice loading animation on the placeholder */
      showLoadingAnimation?: boolean
      customPlaceholder?: undefined
    })
  | (CommonProps & {
      /** pass any renderable content to be used as placeholder instead of the built-in ones */
      customPlaceholder?:
        | React.ReactNode
        | React.ReactElement<{
            [k: string]: any
          }>
      type?: undefined
      rows?: undefined
      color?: undefined
      showLoadingAnimation?: undefined
    })

interface ICardChildProps {
  title?: React.ReactNode
}
