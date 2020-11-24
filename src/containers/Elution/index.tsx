import { Card, Col, Row } from 'antd'
import React, { useContext } from 'react'
import PlateMap from '../../components/PlateMap'
import { PlateContext } from '../../contexts/PlateContext'

const Elution: React.FC = () => {
    const { determinations } = useContext(PlateContext)
    const elutions = Array.from(determinations.reduce((acc, { elution }) => acc.add(elution), new Set()))
    return (
        <>
            {elutions.map(e => (
                <Row style={{ marginBottom: 15 }}>
                    <Col span={24}>
                        <Card title={`Plate - ${e}`}>
                            <Row gutter={30}>
                                <Col span={8}>
                                    <PlateMap samples={determinations.filter(s => s.elution === e)} rowCount={12} />
                                </Col>
                                <Col span={16}>
                                    <h1>Statistcs</h1>
                                    <h3>Not Detected: {(determinations.filter(d => d.elution === e)).filter(d => d.determination === "Not Detected").length}</h3>
                                    <h3>Detected: {(determinations.filter(d => d.elution === e)).filter(d => d.determination === "Detected" && d.sample_id !== "neg" && d.sample_id !== "pc").length}</h3>
                                    <h3>Repeat: {(determinations.filter(d => d.elution === e)).filter(d => d.determination === "Repeat" && d.sample_id !== "neg" && d.sample_id !== "pc").length}</h3>
                                    <h3>Inconclusive: {(determinations.filter(d => d.elution === e)).filter(d => d.determination === "Inconclusive").length}</h3>
                                    <h3>Invalid: {(determinations.filter(d => d.elution === e)).filter(d => d.determination === "Invalid").length}</h3>
                                    <h3>Controls: {(determinations.filter(d => d.elution === e)).filter(d => d.sample_id === "neg" || d.sample_id === "pc").length}</h3>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            ))}
        </>
    )
}

export default Elution
