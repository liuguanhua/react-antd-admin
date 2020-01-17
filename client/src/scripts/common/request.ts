import axios from 'axios'
import { message } from 'antd'

import { default_fetch_options } from '@scripts/constant'
import { clearLoginInfo } from '@scripts/utils'

const { apiRoot, isProd } = window.g_config

/**
 * 公共请求数据
 * @param {IRequestType} opt
 * @returns
 */
const CancelToken = axios.CancelToken
const source = CancelToken.source()

axios.defaults.withCredentials = true
// axios.interceptors.request.use(
//   config => {
//     config.headers.Authorization = ``
//     return config
//   },
//   error => {
//     return Promise.reject(error)
//   }
// )

const captureException = (err, callback: (res) => void) => {
  !isProd && console.error(err)
  const { response, request: req } = (err || {}) as IKeyStringProps
  if (response) {
    const { status } = response
    if (status >= 500) {
      message.error('服务器出错⊙﹏⊙')
    } else if (Object.is(status, 404)) {
      message.error('请求地址不存在⊙﹏⊙')
    } else if (Object.is(status, 401)) {
      return clearLoginInfo()
    }
    return callback(response)
  }
  if (req) {
    const { readyState, status } = req
    if (Object.is(readyState, 4) && Object.is(status, 0)) {
      message.error('请求超时⊙﹏⊙')
    }
    return callback(req)
  }
  if (axios.isCancel(err)) {
    throw err.message
  }
}

const request = (opt: IRequestType) => {
  const options = {
    ...default_fetch_options,
    ...opt
  }
  const {
    method,
    url,
    data,
    params,
    customApi,
    showTips,
    success,
    error
  } = options
  return new Promise<any>((resolve, reject) => {
    axios({
      cancelToken: source.token,
      url: customApi ? url : `${apiRoot}api/${url}`,
      method,
      params,
      data
      // timeout: 5000
    })
      .then(response => {
        const { data: info } = response
        const serveInfo = info || {}
        const { code, msg, result = {}, success: resSuccess } = serveInfo
        // if (Object.is(code, 200) && resSuccess) {
        if (resSuccess) {
          success && success(result)
          return resolve(result)
        }
        if (code >= 400) {
          showTips && msg && message.error(msg)
          if (Object.is(code, 401)) {
            return clearLoginInfo()
          }
        }
        error && error(serveInfo)
        reject(serveInfo)
        throw result
      })
      .catch(err => {
        captureException(err, res => {
          error && error(res)
          return reject(res)
        })
      })
  })
}

// export const _request = (options: IRequestType) => {
//   return request(options)
//     .then(data => data)
//     .catch(err => {
//       console.error(err);
//     });
// };

export default request
// Object.assign(React.Component.prototype, {
//   _request: request,
//   _source: source,
//   _api: api
// })
