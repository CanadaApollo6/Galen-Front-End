import React, { useContext, useState } from 'react'
import { Card, Row, Col, Statistic } from 'antd'
import { ContextGraphOptions } from '../../components/GraphOptions'
import { GraphContextProvider } from '../../contexts/GraphContext'
import { PlateContext } from '../../contexts/PlateContext'
import { SampleDetermination } from '../../types'
import PlateMap from '../../components/PlateMap'
import { SampleGraph } from '../Rows/RowGraphs'


export default () => {
    const { determinations } = useContext(PlateContext)
    const [determination, setDetermination] = useState<SampleDetermination>()
    const statistics = {
        notDetected: determinations.filter(d => d.determination === "Not Detected").length,
        detected: determinations.filter(d => d.determination === "Detected").length,
        repeat: determinations.filter(d => d.determination === "Repeat").length,
        inconclusive: determinations.filter(d => d.determination === "Inconclusive").length - determinations.filter(d => d.sample_id === "neg" || d.sample_id === "pc").length,
        invalid: determinations.filter(d => d.determination === "Invalid").length,
        control: determinations.filter(d => d.sample_id === "neg" || d.sample_id === "pc").length
    }

    return (
        <GraphContextProvider>
            <Row gutter={15}>
                <Col span={15}>
                    <Card>
                        <PlateMap
                            samples={determinations}
                            rowCount={24}
                            onSelect={setDetermination}
                            selectedWells={determination ? [determination] : undefined}
                        />
                    </Card>
                </Col>

                <Col span={9}>
                    <Card>
                        <ContextGraphOptions />
                        <SampleGraph sample={determination} />
                    </Card>
                    <Card style={{marginTop: 15}}>
                        <h1>Statistics</h1>
                        <Row>
                            <Statistic title="Not Detected" value={statistics.notDetected} />
                            <Statistic title="Detected" value={statistics.detected} style={{ margin: '0 20px' }} />
                            <Statistic title="Repeat" value={statistics.repeat} />
                            <Statistic title="Inconclusive" value={statistics.inconclusive} style={{ margin: '0 20px' }}/>
                            <Statistic title="Invalid" value={statistics.invalid}/>
                            <Statistic title="Controls" value={statistics.control} style={{ margin: '0 20px' }}/>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </GraphContextProvider>
    )
}
