import React, { useContext } from 'react'
import { Select } from 'antd'
import { PlateContext } from '../../contexts/PlateContext'

const TargetSelect = () => {
    const { target, setTarget } = useContext(PlateContext)

    return (
        <Select value={target} onChange={v => setTarget(v)}>
            <Select.Option value=''>All</Select.Option>
            <Select.Option value='rp_cy5_delta'>RP-Cy5</Select.Option>
            <Select.Option value='n_gene_delta'>N Gene</Select.Option>
            <Select.Option value='s_gene_delta'>S Gene</Select.Option>
            <Select.Option value='orf1ab_delta'>ORF1ab</Select.Option>
            <Select.Option value='ms2_delta'>MS2</Select.Option>
        </Select>
    )
}

export default TargetSelect
