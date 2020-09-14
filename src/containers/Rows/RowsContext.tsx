import React, { useState, useEffect, useContext } from 'react'
import { SampleDetermination } from '../../types'
import { PlateContext } from '../../contexts/PlateContext'

type RowsContextType = {
    selected: SampleDetermination | undefined
    setSelected: React.Dispatch<SampleDetermination | undefined>
    row: string | undefined
    setRow: React.Dispatch<string>
    showEvaluated: '0' | '1'
    setShowEvaluated: React.Dispatch<'0' | '1'>
    determinations: SampleDetermination[]
    rows: [string, number][]
}

export const RowsContext = React.createContext<RowsContextType>({
    selected: undefined,
    setSelected: () => undefined,
    row: undefined,
    setRow: () => undefined,
    showEvaluated: '0',
    setShowEvaluated: () => undefined,
    determinations: [],
    rows: []
})

export const RowsContextProvider: React.FC = ({ children }) => {
    const [selected, setSelected] = useState<SampleDetermination>()
    const [row, setRow] = useState<string>()
    const [determinations, setDeterminations] = useState<SampleDetermination[]>([])
    const [showEvaluated, setShowEvaluated] = useState<'0' | '1'>('0')
    const { determinations: d } = useContext(PlateContext)
    const [rows, setRows] = useState<[string, number][]>([])

    useEffect(() => {
        if (!row) return

        setDeterminations(d
            .filter(x => x.well.substr(0, 1) === row)
            .filter(x => showEvaluated === '0' ? !x.evaluated : true))
    }, [d, row, setDeterminations, showEvaluated])

    useEffect(() => {
        if (!d) return

        const row_dictionary = d
            .map(({ well, prediction }): [string, number] => [well.substring(0, 1), prediction === 'Detected' ? 1 : 0])
            .reduce((acc: Record<string, number>, [row, pos]) => ({ ...acc, [row]: acc[row] ? acc[row] + pos : pos }), {})

        const r: [string, number][] = Object.keys(row_dictionary).map(key => [key, row_dictionary[key]])

        setRows(r)
    }, [d, setRows, setRow])

    return (
        <RowsContext.Provider value={{ selected, setSelected, row, setRow, showEvaluated, setShowEvaluated, determinations, rows }}>
            {children}
        </RowsContext.Provider>
    )
}
