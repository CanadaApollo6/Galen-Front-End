import React, { useContext } from 'react'
import { PlateContext } from '../../contexts/PlateContext'
import { Select } from 'antd'
import { Determination, SampleDetermination, Amplification } from '../../types'

const DeterminationSelect: React.FC<{ sample: SampleDetermination }> = ({
    sample,
}) => {
    const { determinations, setDeterminations } = useContext(PlateContext)
    const options: Determination[] = [
        'Detected',
        'Not Detected',
        'Invalid',
        'Inconclusive',
        'Repeat',
    ]

    const onChange = (determination: Determination) => {
        const amplifications: Amplification[] =
            determination === 'Detected' ? ['N Gene', 'S Gene', 'ORF1ab'] : []

        setDeterminations(
            determinations.map((d) =>
                d.well === sample.well
                    ? { ...d, determination, amplifications }
                    : d
            )
        )
    }

    return (
        <Select
            onChange={onChange}
            style={{ width: 130 }}
            value={
                determinations.find((s) => s.well === sample.well)
                    ?.determination
            }
        >
            {[options.map((o) => <Select.Option value={o}>{o}</Select.Option>)]}
        </Select>
    )
}

export default DeterminationSelect
