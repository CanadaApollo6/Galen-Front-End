import React, { useState, useEffect } from 'react'
import { Sample, RnType, Rns } from '../types'
import { isArray } from 'util'
import { act } from 'react-dom/test-utils'

export type GraphType = 'linear' | 'logarithmic'

type PlateContextState = {
    file: File | undefined,
    setFile: (file: File) => void,
    samples: Sample[],
    setSamples: (results: Sample[]) => void,
    activeSamples: Sample | Sample[] | undefined,
    setActiveSamples: (s: Sample | Sample[]) => void,
    graphType: GraphType,
    setGraphType: (t: GraphType) => void,
    target: RnType | undefined,
    setTarget: (t: RnType) => void,
    scale: number | undefined,
    setScale: (scale: number) => void,
    scales: number[] | undefined,
    setScales: (scales: number[]) => void
}

export const PlateContext = React.createContext<PlateContextState>({
    file: undefined,
    setFile: () => undefined,
    samples: [],
    setSamples: () => undefined,
    activeSamples: undefined,
    setActiveSamples: () => undefined,
    graphType: 'linear',
    setGraphType: () => undefined,
    target: undefined,
    setTarget: () => undefined,
    scale: undefined,
    setScale: () => undefined,
    scales: undefined,
    setScales: () => undefined
})

export const PlateContextProvider: React.FC = ({ children }) => {
    const [file, setFile] = useState<File>()
    const [samples, setSamples] = useState<Sample[]>([])
    const [activeSamples, setActiveSamples] = useState<Sample | Sample[]>()
    const [graphType, setGraphType] = useState<GraphType>('linear')
    const [target, setTarget] = useState<RnType>()
    const [scale, setScale] = useState<number>()
    const [scales, setScales] = useState<number[]>()

    useEffect(() => {
        if (!activeSamples) return
        const scale_steps = 100000

        console.log(activeSamples)

        const getSampleMaxRn = ({ rns }: Sample): number => Math.max(...Object.keys(rns).filter(k => k.includes('delta')).map(k => rns[k as RnType]).flat())

        const max = isArray(activeSamples)
            ? Math.max(...activeSamples.map(getSampleMaxRn))
            : getSampleMaxRn(activeSamples)

        const scale_max = Math.ceil(max / scale_steps) * scale_steps

        setScale(scale_max)
        setScales(new Array(scale_max / scale_steps).fill(0).map((x, i) => (i + 1) * scale_steps))
    }, [activeSamples])

    return (
        <PlateContext.Provider value={{ file, setFile, samples, setSamples, activeSamples, setActiveSamples, graphType, setGraphType, target, setTarget, scale, setScale, scales, setScales }}>
            {children}
        </PlateContext.Provider>
    )
}
