import React from 'react'
import { SampleDetermination } from '../types'

const getSquareColor = (d: SampleDetermination, selectedWells: SampleDetermination[] | undefined): string => {
    if (selectedWells?.some(w => w.well === d.well)) return 'blue'
    if (['neg', 'PC'].includes(d.sample_id)) return 'grey'
    if (d.determination === 'Detected') return 'red'
    if (d.determination === 'Repeat') return 'yellow'

    return ''
}

type SampleSquareProps = { sample: SampleDetermination, onSelect?: (sample: SampleDetermination) => void, selectedWells?: SampleDetermination[] }

const SampleSquare: React.FC<SampleSquareProps> = ({ sample, onSelect, selectedWells }) => (
    <div style={{ display: 'table-cell' }}>
        <div onClick={onSelect ? () => onSelect(sample) : () => undefined} style={{ paddingTop: '100%', background: getSquareColor(sample, selectedWells), border: '2px solid #d9d9d9', position: 'relative', margin: -1 }}>
            <span style={{ position: 'absolute', top: 5, bottom: 0, left: 5, right: 0 }}>{sample.well}</span>
        </div>
    </div>
)

type RowProps = { samples: SampleDetermination[], onSelect?: (sample: SampleDetermination) => void, selectedWells?: SampleDetermination[] }

const Row: React.FC<RowProps> = ({ samples, onSelect, selectedWells }) =>
    <div style={{ display: 'table', width: '100%' }}>{samples.map(s => <SampleSquare sample={s} onSelect={onSelect} selectedWells={selectedWells} />)}</div>

type PlateProps = { samples: SampleDetermination[], rowCount: number, onSelect?: (sample: SampleDetermination) => void, selectedWells?: SampleDetermination[] }
type SampleRowAccumaltor = [SampleDetermination[][], SampleDetermination[]]

const PlateMap: React.FC<PlateProps> = ({ samples, rowCount, onSelect, selectedWells }) => {
    const reducer = (acc: SampleRowAccumaltor, s: SampleDetermination, i: number): SampleRowAccumaltor =>
        i % rowCount === rowCount - 1 ? [acc[0].concat([[...acc[1], s]]), []] : [acc[0], [...acc[1], s]]

    const rows: SampleDetermination[][] = samples.reduce(reducer, [[], []])[0]

    return <div style={{ width: '100%' }}>{rows.map(s => <Row samples={s} onSelect={onSelect} selectedWells={selectedWells} />)}</div>
}

export default PlateMap
