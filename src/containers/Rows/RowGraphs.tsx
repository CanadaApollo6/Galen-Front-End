import React, { useContext } from 'react'
import { AmpChart } from '../../components/AmpChart'
import { ContextGraphOptions } from '../../components/GraphOptions'
import { RowsContext } from './RowsContext'

const RowGraph: React.FC = () => {
    const { determinations, row } = useContext(RowsContext)
    const row_text = row ? row : 'None Selected'

    return (
        <>
            <h2>Row - {row_text}</h2>
            <AmpChart determinations={determinations} />
        </>
    )
}

const SampleGraph: React.FC = () => {
    const { selected } = useContext(RowsContext)
    const sample_text = selected ? `${selected.well} (${selected.sample_id})` : 'None Selected'

    return (
        <>
            <h2>Sample - {sample_text}</h2>
            <AmpChart determinations={selected ? [selected] : []} />
        </>
    )
}

const RowGraphs: React.FC = () => (
    <>
        <ContextGraphOptions />
        <RowGraph />
        <SampleGraph />
    </>
)

export default RowGraphs
