import React from 'react'
import { withRouter } from 'react-router-dom'
import { isArray, isUndefined, isString } from 'util'

import { default_fetch_options, PAGE_SIZE } from '@scripts/constant'
import { isFunction } from '@scripts/utils'
import request from '@scripts/common'
import api from '@scripts/common/api'

import { LoadPage, TipsWrapContent } from '@components/common'

interface IBeforeFetchState {
  success: boolean
  info: any
}

const setCutUrl = (
  fetchUrl: TFetchUrlType = '',
  isCustom: boolean = false
): string => {
  if (isString(fetchUrl)) {
    return isCustom ? fetchUrl : api[fetchUrl]
  }
  const { apiKey, route } = fetchUrl
  return `${isCustom ? apiKey : api[apiKey]}${route ? `/${route}` : ''}`
}

type IWrapComponentProps<T = {}> = React.ComponentType<
  T & IBeforeFetchEmitProps
>

export default function beforeFetchData<T = IKeyStringProps>(
  parames: IBeforeFetchDataProps<T>
) {
  return function WithBeforeFetch(
    WrappedComponent: IWrapComponentProps<T>,
    insideOption: {
      position?: 'top' | 'bottom'
      executeComponent?: IWrapComponentProps<T>
      customNotData?: React.ReactNode
      noDataTips?: string | IRequestParames<T, string | undefined>
    } = {}
  ): React.ComponentType<T> {
    const {
      executeComponent: ExecuteComponent,
      position = 'bottom',
      customNotData,
      noDataTips
    } = insideOption
    const isTop = Object.is(position, 'top')
    @(withRouter as any)
    class BeforeFetchCompt extends React.Component<T, IBeforeFetchState> {
      private options: IBeforeFetchDataProps<T>
      // private fetchOpt!: IBeforeFetchDataProps<T>;
      constructor(props: T) {
        super(props)
        this.options = {
          ...default_fetch_options,
          isPagination: false,
          autoFetch: true,
          hijack: true,
          ...parames
        }
      }
      state: IBeforeFetchState = {
        info: null,
        success: false
      }
      private getOptionMethod<V = boolean>(value: any): V {
        return isFunction(value) ? value.call(this.options, this.props) : value
      }
      private get isAutoFetch() {
        const { autoFetch } = this.options
        return this.getOptionMethod(autoFetch)
      }
      private get isHijack() {
        const { hijack } = this.options
        return this.getOptionMethod(hijack)
      }
      private getUrl = () => {
        const { url, isCustomUrl } = this.options
        return setCutUrl(this.getOptionMethod<TFetchUrlType>(url), isCustomUrl)
      }
      private getParams = () => {
        const { params } = this.options
        return this.getOptionMethod<IKeyStringProps>(params) || {}
      }
      private getData = () => {
        const { data } = this.options
        return this.getOptionMethod<IKeyStringProps>(data) || {}
      }
      private get noDataTips() {
        return this.getOptionMethod<string>(noDataTips)
      }
      private errorCallback() {
        const { error, defaultData = {} } = this.options
        this.setState(
          { success: true, info: this.isHijack ? null : defaultData },
          () => {
            error && error(this.state)
          }
        )
      }
      private fetchData = (opt: IBeforeFetchOptionProps = {}) => {
        const { pageIndex = 1, params, callback = () => {} } = opt
        const { method, success, isPagination } = this.options
        const apiUrl = this.getUrl()
        if (!apiUrl) {
          return this.setState({
            success: true
          })
        }
        const sendParams = this.getParams()
        const data = this.getData()
        const fetchOpt = {
          method,
          url: apiUrl,
          params: {
            ...sendParams,
            ...(isPagination && {
              pageIndex: pageIndex,
              pageSize: sendParams.pageSize || PAGE_SIZE
            }),
            ...params
          },
          data
        }
        // this.fetchOpt = fetchOpt;
        request(fetchOpt)
          .then(result => {
            // result = []
            const values = {
              success: true,
              result
            }
            const flag =
              this.isHijack &&
              (!result ||
                (isArray(result)
                  ? !result.length
                  : isArray(result.data) && !result.data.length))
            if (flag) {
              callback(values)
              return this.errorCallback()
            }
            this.setState(
              {
                info: result,
                success: true
              },
              () => {
                callback(values)
                success && success(this.state)
              }
            )
          })
          .catch(err => {
            callback({
              success: false,
              result: err
            })
            this.errorCallback()
          })
      }
      componentDidMount() {
        this.isAutoFetch && this.fetchData()
      }
      componentWillUnmount() {
        this.setState = () => ({})
      }
      render() {
        const { info, success: stateSuccess } = this.state
        const props = {
          fetchData: this.fetchData,
          serveData: info,
          // options: {
          //   ...this.options,
          //   ...this.fetchOpt
          // },
          ...this.props
        }
        return (
          <>
            {isTop && ExecuteComponent && <ExecuteComponent {...props} />}
            {info ? (
              <WrappedComponent {...props} />
            ) : stateSuccess ? (
              <>
                {isUndefined(customNotData) ? (
                  <TipsWrapContent text={this.noDataTips} />
                ) : (
                  customNotData
                )}
              </>
            ) : (
              <>
                {this.isAutoFetch ? (
                  <TipsWrapContent>
                    <LoadPage />
                  </TipsWrapContent>
                ) : null}
              </>
            )}
            {!isTop && ExecuteComponent && <ExecuteComponent {...props} />}
          </>
        )
      }
    }
    return BeforeFetchCompt
  }
}
