import React, { Component, ReactChild, Suspense } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'

interface IErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<
  RouteComponentProps,
  IErrorBoundaryState
> {
  constructor(props: RouteComponentProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error(error, info)
  }

  render() {
    const { children } = this.props
    const { hasError } = this.state
    return hasError ? (
      <span className="highlight">
        加载失败,请
        <a
          style={{ borderBottom: '1px solid #40a9ff' }}
          href={window.location.href}
        >
          &nbsp;刷新&nbsp;
        </a>
        ！
      </span>
    ) : (
      children
    )
  }
}

const WrapErrorBoundary = withRouter(ErrorBoundary)

interface ILazyRenderComptProps {
  fallback?: NonNullable<ReactChild> | null
}

const LazyRenderCompt: React.FC<ILazyRenderComptProps> = props => {
  const { fallback, children } = props
  return (
    <WrapErrorBoundary>
      <Suspense fallback={fallback || null}>{children}</Suspense>
    </WrapErrorBoundary>
  )
}
export default LazyRenderCompt
