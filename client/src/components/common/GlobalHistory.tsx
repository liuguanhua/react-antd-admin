//ref:npm react-router-global-history
import React from 'react'
import { withRouter, Route, RouteComponentProps } from 'react-router-dom'

let globalHistory: any = null

const Spy: React.FC<RouteComponentProps> = ({ history }) => {
  window.g_history = history
  globalHistory = history
  return null
}

const withSpy = withRouter(Spy)

export const ReactRouterGlobalHistory = () => <Route component={withSpy} />

export default function getHistory() {
  if (!globalHistory) {
    throw new Error(
      'No history Object. You probably forgot to mount ReactRouterGlobalHistory from this package.'
    )
  }
  return globalHistory
}
