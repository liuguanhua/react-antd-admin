import React, { useState, useContext } from 'react'
import {
  useWait,
  Waiter,
  TWaitMethod,
  IWaitContextProps,
  IWaitProps
} from './react-wait'
import { LoadPage, TipsWrapContent } from '@components/common'

interface ICoverWaitContextProps {
  error: string[]
  triggerError: TWaitMethod
  destroyError: TWaitMethod
  isError: (err?: string) => boolean
}

const initCtx: ICoverWaitContextProps = {
  error: [],
  triggerError: () => {},
  destroyError: () => {},
  isError: () => false
}

const CoverContext = React.createContext(initCtx)

interface IWaitRenderProps extends IWaitProps {
  content?: {
    error?: React.ReactNode
    text?: string
  }
}

const CoverWait: React.FC<IWaitRenderProps> = ({
  children,
  on = '',
  fallback,
  content
}) => {
  const { Wait } = useWait() as any
  const context = useContext(CoverContext)
  if (context.error.includes(on)) {
    const { error = null, text = '' } = content || {}
    return error ? <>{error}</> : <TipsWrapContent text={text} />
  }
  const props = {
    ...(on && {
      on
    }),
    fallback: fallback || <LoadPage />
  }
  return <Wait {...props}>{children || null}</Wait>
}

export const WaiterProvider: React.FC = ({ children }) => {
  const [error, setError] = useState<string[]>([])
  return (
    <CoverContext.Provider
      value={{
        error,
        triggerError: err => {
          setError(err ? [...error, err] : error)
        },
        destroyError: err => {
          setError(error.filter(v => v !== err))
        },
        isError: (err = '') => error.includes(err)
      }}
    >
      <Waiter>{children}</Waiter>
    </CoverContext.Provider>
  )
}

export function useCoverWait(): IWaitContextProps &
  ICoverWaitContextProps & {
    CoverWait: React.FC<IWaitRenderProps>
  } {
  const context = useContext(CoverContext)
  const { startWaiting, ...rest } = useWait()
  return {
    ...context,
    ...rest,
    CoverWait,
    startWaiting(waiter: string = '') {
      startWaiting(waiter)
      context.destroyError(waiter)
    }
  }
}
