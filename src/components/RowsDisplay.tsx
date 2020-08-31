import React, { useContext, useState } from 'react'
import { PlateContext } from '../contexts/PlateContext'
import { Select, Form, Row, Col, Badge, Descriptions, Card, Modal } from 'antd'
import TargetSelect from './Inputs/TargetSelect'
import GraphTypeSelect from './Inputs/GraphTypeSelect'
import ScaleSelect from './Inputs/ScaleSelect'
import { isArray } from 'util'
import { Sample } from '../types'
import { SampleChart } from './DeltaRnVsCyclesChart'

const SampleModal: React.FC<{ sample: Sample, visible: boolean, setVisible: (x: boolean) => void }> = ({ sample, visible, setVisible }) => {
    return (
        <Modal title={`${sample.well} - ${sample.id}`} visible={visible} onOk={() => setVisible(false)}>
            <SampleChart samples={[sample]} scale={undefined} target={undefined} graphType={"linear"}/>
        </Modal>
    )
}

const SampleDisplay: React.FC<{ sample: Sample }> = ({ sample }) => {
    const [showModal, setShowModal] = useState(false)

    const isDetected = sample.determination === 'Detected'

    return (
        <Col xs={8} lg={6}>
            <Card size='small' hoverable={true} onClick={() => setShowModal(true)} title={<Badge dot={isDetected}>{sample.well}&nbsp;</Badge>}>
                <p><b>Sample ID:</b> {sample.id}</p>
                <p><b>Prediction:</b> {sample.determination}</p>
                <p><b>Confidence:</b> {sample.confidence}</p>
            </Card>
            <SampleModal visible={showModal} setVisible={setShowModal} sample={sample} />
        </Col>
    )
}

const RowSampleDisplays: React.FC = () => {
    const { activeSamples } = useContext(PlateContext)

    if (!isArray(activeSamples)) return null

    return (
        <Row gutter={[15, 15]}>{activeSamples.map(s => <SampleDisplay sample={s} />)}</Row>
    )
}

const RowsDisplay: React.FC = () => {
    const { samples, setActiveSamples } = useContext(PlateContext)
    const [row, setRow] = useState<string>()
    const columns = Array.from(samples.reduce((acc, val) => acc.add(val.well.replace(/\d+/g, '')), new Set<string>()))

    const onChange = (r: string) => {
        setActiveSamples(samples.filter(s => s.well.includes(r)))
        setRow(r)
    }

    return (
        <>
            <Form>
                <Row gutter={15}>
                    <Col lg={6}>
                        <Form.Item label='Row'>
                            <Select value={row} onChange={onChange}>
                                {columns.map(c => <Select.Option value={c}>
                                    <span style={{ float: "left" }}>{c}</span>
                                    <div style={{ float: "right" }}>
                                        <Badge count={samples.filter(s => s.well.includes(c)).filter(s => s.determination === 'Detected').length} />
                                    </div>
                                </Select.Option>)}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col lg={6}>
                        <Form.Item label='Target'>
                            <TargetSelect />
                        </Form.Item>
                    </Col>

                    <Col lg={6}>
                        <Form.Item label='Graph Type'>
                            <GraphTypeSelect />
                        </Form.Item>
                    </Col>

                    <Col lg={6}>
                        <Form.Item label='Scale'>
                            <ScaleSelect />
                        </Form.Item>
                    </Col>
                </Row>

                <RowSampleDisplays />
            </Form>
        </>
    )
}

export default RowsDisplay
