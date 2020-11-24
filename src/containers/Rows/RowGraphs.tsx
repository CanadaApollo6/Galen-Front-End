import React, { useContext } from 'react'
import { AmpChart } from '../../components/AmpChart'
import { ContextGraphOptions } from '../../components/GraphOptions'
import { SampleDetermination } from '../../types'
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

type SampleGraphProps = { sample: SampleDetermination | undefined }

export const SampleGraph: React.FC<SampleGraphProps> = ({ sample }) => {
    const sample_text = sample ? `${sample.well} (${sample.sample_id})` : 'None Selected'

    return (
        <>
            <h2 style={{marginTop: 10}}>Sample - {sample_text}</h2>
            <AmpChart determinations={sample ? [sample] : []} />
        </>
    )
}

const RowContextSampleGraph: React.FC = () => {
    const { selected } = useContext(RowsContext)

    return <SampleGraph sample={selected} />
}

const RowGraphs: React.FC = () => (
    <>
        <ContextGraphOptions />
        <RowGraph />
        <RowContextSampleGraph />
    </>
)

export default RowGraphs
