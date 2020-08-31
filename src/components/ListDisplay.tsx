import React, { useContext } from 'react'
import { Table } from 'antd'
import { PlateContext } from '../contexts/PlateContext'
import { Sample } from '../types'

const ListDisplay = () => {
    const { samples, setActiveSamples: setActiveSample } = useContext(PlateContext)
    const columns = [
        { title: 'Sample Id', dataIndex: 'id', key: 'id' },
        { title: 'Well', dataIndex: 'well', key: 'well' },
        { title: 'Determination', dataIndex: 'determination', key: 'determination' },
        { title: 'Confidence', dataIndex: 'confidence', key: 'confidence', render: (c: number) => `${(c * 100).toFixed(2)}%` }
    ]

    if (samples.length === 0) return null

    const onRow = (sample: Sample) => ({
        onClick: () => setActiveSample(sample)
    })

    return (
        <Table dataSource={samples} columns={columns} onRow={onRow} />
    )
}

export default ListDisplay
