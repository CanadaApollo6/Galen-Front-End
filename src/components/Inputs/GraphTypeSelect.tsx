import React, { useContext } from 'react'
import { Select } from 'antd'
import { PlateContext } from '../../contexts/PlateContext'

const GraphTypeSelect = () => {
    const { graphType, setGraphType } = useContext(PlateContext)

    return (
        <Select value={graphType} onChange={v => setGraphType(v)}>
            <Select.Option value='linear'>Linear</Select.Option>
            <Select.Option value='logarithmic'>Logarithmic</Select.Option>
        </Select>
    )
}

export default GraphTypeSelect
