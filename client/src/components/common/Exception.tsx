import * as React from 'react'

interface IExceptionProps {
  status?: 403 | 404 | 500 | number | string
}

const errorStatus = {
  403: {
    desc: '无权访问⊙﹏⊙'
  },
  404: {
    desc: '找不到页面⊙﹏⊙'
  },
  500: {
    desc: '服务器出错⊙﹏⊙'
  }
}

export default function Exception(props: IExceptionProps) {
  const { status = 404 } = props
  return (
    <div className="tc font-size-lg" style={{ paddingTop: 30 }}>
      {errorStatus[status] ? errorStatus[status].desc : status}
    </div>
  )
}
