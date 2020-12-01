import React, { useState } from 'react'
import { SampleDetermination, SampleRns } from '../types'

type PlateContextState = {
    file: File | undefined
    setFile: React.Dispatch<File>
    determinations: SampleDetermination[]
    setDeterminations: React.Dispatch<SampleDetermination[]>
    rns: SampleRns
    setRns: React.Dispatch<SampleRns>
}

export const PlateContext = React.createContext<PlateContextState>({
    file: undefined,
    setFile: () => undefined,
    determinations: [],
    setDeterminations: () => undefined,
    rns: {},
    setRns: () => undefined,
})

export const PlateContextProvider: React.FC = ({ children }) => {
    const [file, setFile] = useState<File>()
    const [determinations, setDeterminations] = useState<SampleDetermination[]>(
        []
    )
    const [rns, setRns] = useState<SampleRns>({})

    return (
        <PlateContext.Provider
            value={{
                file,
                setFile,
                determinations,
                setDeterminations,
                rns,
                setRns,
            }}
        >
            {children}
        </PlateContext.Provider>
    )
}
