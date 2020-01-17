import * as React from 'react'
import { Action, ModalsState } from './draggableModalReducer'

export interface DraggableModalContextMethods {
    dispatch: (action: Action) => void
}

export interface DraggableModalContextValue extends DraggableModalContextMethods {
    state: ModalsState
}

export const DraggableModalContext = React.createContext<DraggableModalContextValue | null>(null)
