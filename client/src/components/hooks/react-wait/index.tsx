//ref:https://github.com/f/react-wait 改写react-wait，原包不支持一起调用多个

import React, { useState, useContext } from 'react'
import { usePrevious } from '../usePrevious'
import { isUndefined } from 'util'

const anyWaiting = waiters => waiters.length > 0

const isWaiting = (waiters, waiter) => waiters.includes(waiter)

const startWaiting = (waiters, waiter) => {
  if (isWaiting(waiters, waiter)) return waiters
  return [...waiters, waiter]
}

const endWaiting = (waiters, waiter) => {
  return waiters.filter(w => w !== waiter)
}

export type TWaitMethod = (v?: string) => void

interface IWaitSharedProps {
  startWaiting: TWaitMethod
  endWaiting: TWaitMethod
  isWaiting: (waiter?: string) => boolean
}

export interface IWaitContextProps extends IWaitSharedProps {
  anyWaiting: () => boolean
  waiters: string[]
  createWaitingContext?: (
    waiter?: string
  ) => IWaitSharedProps & {
    Wait: (props: IWaitProps) => React.ReactNode
  }
}

export interface IWaitProps {
  on?: string
  fallback?: React.ReactNode
}

const WaitingContext = React.createContext<IWaitContextProps>({
  startWaiting: () => {},
  endWaiting: () => {},
  isWaiting: () => false,
  anyWaiting: () => false,
  waiters: []
})

function Wait(props) {
  const { on, fallback, children } = props
  const context = useContext(WaitingContext)
  const prevWaiting = usePrevious(context.isWaiting(on))
  return context.waiters.includes(on) || isUndefined(prevWaiting)
    ? fallback
    : children
}

export function Waiter(props) {
  // const keepWaiters = useRef<string[]>([]);
  const [waiters, setWaiters] = useState([])
  return (
    <WaitingContext.Provider
      value={{
        waiters,
        createWaitingContext: waiter => ({
          isWaiting: () => isWaiting(waiters, waiter),
          startWaiting: () => setWaiters(startWaiting(waiters, waiter)),
          endWaiting: () => setWaiters(endWaiting(waiters, waiter)),
          Wait: props => <Wait on={waiter} {...props} />
        }),
        anyWaiting: () => anyWaiting(waiters),
        isWaiting: waiter => isWaiting(waiters, waiter),
        startWaiting(waiter) {
          //如果是一起触发的，此处使用waiters得不到新的
          // if (waiter) {
          //   keepWaiters.current = [...keepWaiters.current, waiter];
          // }
          // setWaiters(startWaiting(keepWaiters.current, waiter));
          setWaiters(waiters => startWaiting(waiters, waiter))
        },
        endWaiting(waiter) {
          // keepWaiters.current = endWaiting(keepWaiters.current, waiter);
          // setWaiters(endWaiting(keepWaiters.current, waiter));
          setWaiters(waiters => endWaiting(waiters, waiter))
        }
      }}
    >
      {props.children}
    </WaitingContext.Provider>
  )
}

export function useWait() {
  const context = useContext(WaitingContext)
  return {
    ...context,
    Wait
  }
}
