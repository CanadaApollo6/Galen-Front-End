import React, { useContext } from 'react'
import { PlateContext } from '../contexts/PlateContext'
import { Row, Col } from 'antd'

const PlateColumn: React.FC<{ row: string }> = ({ row }) => {
    const { samples, setActiveSamples: setActiveSample } = useContext(PlateContext)
    const r = samples.filter(s => s.well.includes(row))

    return (
        <Row>
            {
                r.map(s =>
                    <Col onClick={() => setActiveSample(s)} xs={1}>
                        <div style={{ border: '1px solid #d9d9d9', textAlign: 'center', background: s.determination === 'Detected' ? 'red' : '', padding: '5px 0 5px' }}>
                            {s.well}
                        </div>
                    </Col>
                )
            }
        </Row>
    )
}

const PlateDisplay = () => {
    const { samples } = useContext(PlateContext)
    const rows = samples.reduce((acc, val) => acc.add(val.well.replace(/\d+/g, '')), new Set<string>())

    return <>{Array.from(rows).map(r => <PlateColumn row={r} />)}</>
}

export default PlateDisplay
