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
                                    <p>TODO - Reasons and Statistics</p>
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
