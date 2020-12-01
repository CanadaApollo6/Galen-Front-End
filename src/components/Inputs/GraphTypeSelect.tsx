import React, { useContext } from 'react'
import { Select } from 'antd'
import { GraphType } from '../../types'
import { GraphContext } from '../../contexts/GraphContext'

export const ContextGraphTypeSelect: React.FC = () => {
    const { graphType, setGraphType } = useContext(GraphContext)

    return (
        <GraphTypeSelect graphType={graphType} setGraphType={setGraphType} />
    )
}

type GraphTypeSelectProps = {
    graphType: GraphType
    setGraphType: (gt: GraphType) => void
}

export const GraphTypeSelect: React.FC<GraphTypeSelectProps> = ({
    graphType,
    setGraphType,
}) => {
    return (
        <Select value={graphType} onChange={(v) => setGraphType(v)}>
            <Select.Option value="linear">Linear</Select.Option>
            <Select.Option value="logarithmic">Logarithmic</Select.Option>
        </Select>
    )
}
