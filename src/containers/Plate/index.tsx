import React, { useContext, useState } from 'react'
import { Card, Row, Col } from 'antd'
import { ContextGraphOptions } from '../../components/GraphOptions'
import { GraphContextProvider } from '../../contexts/GraphContext'
import { PlateContext } from '../../contexts/PlateContext'
import { SampleDetermination } from '../../types'
import PlateMap from '../../components/PlateMap'
import { SampleGraph } from '../Rows/RowGraphs'

export default () => {
    const { determinations } = useContext(PlateContext)
    const [determination, setDetermination] = useState<SampleDetermination>()

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
                </Col>
            </Row>
        </GraphContextProvider>
    )
}
