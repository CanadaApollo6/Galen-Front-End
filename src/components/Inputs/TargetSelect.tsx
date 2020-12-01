import React, { useContext } from 'react'
import { Select } from 'antd'
import { RnDeltaType } from '../../types'
import { GraphContext } from '../../contexts/GraphContext'

export const ContextTargetSelect: React.FC = () => {
    const { target, setTarget } = useContext(GraphContext)

    return <TargetSelect target={target} setTarget={setTarget} />
}

type TargetSelectProps = {
    target: RnDeltaType | undefined | ''
    setTarget: React.Dispatch<RnDeltaType | '' | undefined>
}

export const TargetSelect: React.FC<TargetSelectProps> = ({
    target,
    setTarget,
}) => (
    <Select value={target} defaultValue={''} onChange={(v) => setTarget(v)}>
        <Select.Option value="">All</Select.Option>
        <Select.Option value="rp_cy5_delta">RP-Cy5</Select.Option>
        <Select.Option value="n_gene_delta">N Gene</Select.Option>
        <Select.Option value="s_gene_delta">S Gene</Select.Option>
        <Select.Option value="orf1ab_delta">ORF1ab</Select.Option>
        <Select.Option value="ms2_delta">MS2</Select.Option>
    </Select>
)
