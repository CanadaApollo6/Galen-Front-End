import React, { useState } from 'react'
import { RnDeltaType, GraphType } from '../types'

type GraphContextState = {
    graphType: GraphType
    setGraphType: React.Dispatch<GraphType>
    target: RnDeltaType | undefined | ''
    setTarget: React.Dispatch<RnDeltaType | undefined | ''>
    scale: number | undefined
    setScale: React.Dispatch<number>
    scales: number[] | undefined
    setScales: React.Dispatch<number[]>
}

export const GraphContext = React.createContext<GraphContextState>({
    graphType: 'linear',
    setGraphType: () => undefined,
    target: undefined,
    setTarget: () => undefined,
    scale: undefined,
    setScale: () => undefined,
    scales: undefined,
    setScales: () => undefined
})

export const GraphContextProvider: React.FC = ({ children }) => {
    const [graphType, setGraphType] = useState<GraphType>('linear')
    const [target, setTarget] = useState<RnDeltaType | ''>()
    const [scale, setScale] = useState<number>()
    const [scales, setScales] = useState<number[]>()

    return (
        <GraphContext.Provider value={{ graphType, setGraphType, target, setTarget, scale, setScale, scales, setScales }}>
            {children}
        </GraphContext.Provider>
    )
}
