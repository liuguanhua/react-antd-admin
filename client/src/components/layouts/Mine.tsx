import * as React from 'react'

import { withAuthRoute, hasRoutePath } from '@components/high-order'

const Mine: React.FC = ({ children }) => {
  return <>{children}</>
}

export default withAuthRoute<IRouteProps>()(hasRoutePath(Mine))
