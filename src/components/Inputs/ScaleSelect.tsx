import React, { useContext } from 'react'
import { PlateContext } from '../../contexts/PlateContext'
import { Select } from 'antd'

const ScaleSelect = () => {
    const { scale, setScale, scales } = useContext(PlateContext)

    return (
        <Select value={scale} onChange={setScale}>
            {scales?.map(s => <Select.Option value={s}>{s}</Select.Option>)}
        </Select>
    )
}

export default ScaleSelect
