import React, { useContext } from 'react'
import { Table, Tooltip } from 'antd'
import DeterminationSelect from '../../components/Inputs/DeterminationSelect';
import { SampleDetermination } from '../../types'
import { RowsContext } from './RowsContext';
import EvaluatedButton from '../../components/EvaluatedButton';
import AmpButtons from '../../components/AmpButtons';

const RowTable = () => {
    const { determinations, selected, setSelected } = useContext(RowsContext)

    const columns = [
        {
            title: 'Well',
            dataIndex: 'well',
            key: 'well',
            sorter: (a: SampleDetermination, b: SampleDetermination) => parseInt(a.well.substring(1, 3)) - parseInt(b.well.substring(1, 3)),
        },
        {
            title: 'Sample Id',
            dataIndex: 'sample_id',
            key: 'sample_id',
            sorter: (a: SampleDetermination, b: SampleDetermination) => a.sample_id?.localeCompare(b.sample_id || '') || 0,
        },
        {
            title: 'Prediction',
            dataIndex: 'prediction',
            key: 'prediction',
            render: (prediction: string, { confidence: c }: SampleDetermination) => <Tooltip title={`Confidence: ${(c * 100).toFixed(2)}%`}><span>{prediction}</span></Tooltip>,
            sorter: (a: SampleDetermination, b: SampleDetermination) => a.prediction?.localeCompare(b.prediction || '') || 0,
            onFilter: (value: string | number | boolean, record: SampleDetermination) => record.prediction?.indexOf(value.toString()) === 0 || false,
        },
        {
            title: 'Amplified',
            dataIndex: 'well',
            key: 'well',
            render: (w: string, determination: SampleDetermination) => <AmpButtons determination={determination} />,
            sorter: (a: SampleDetermination, b: SampleDetermination) => b.amplifications.length - a.amplifications.length,
        },
        {
            title: 'Determination',
            dataIndex: 'determination',
            key: 'determination',
            render: (x: any, determination: SampleDetermination) => <DeterminationSelect sample={determination} />,
            sorter: (a: SampleDetermination, b: SampleDetermination) => a.determination?.localeCompare(b.determination || '') || 0,
            onFilter: (value: string | number | boolean, record: SampleDetermination) => record.determination?.indexOf(value.toString()) === 0 || false,
        },
        {
            title: '',
            dataIndex: 'well',
            key: 'well',
            render: (x: any, determination: SampleDetermination) => <EvaluatedButton determination={determination} />
        }
    ]

    const onRow = (e: SampleDetermination) => {
        return {
            onClick: () => setSelected(e)
        }
    }

    return <Table rowKey='well' columns={columns} dataSource={determinations} onRow={onRow} rowSelection={{ type: 'radio', selectedRowKeys: selected ? [selected.well] : [] }} />
}

export default RowTable
