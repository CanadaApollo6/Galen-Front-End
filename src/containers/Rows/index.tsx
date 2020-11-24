import React from 'react'
import { Card, Row, Col, Divider } from 'antd'
import { GraphContextProvider } from '../../contexts/GraphContext'
import { RowsContextProvider } from './RowsContext'
import RowTable from './RowTable'
import RowFilter from './RowFilter'
import RowGraphs from './RowGraphs'

const Rows: React.FC = () => (
    <RowsContextProvider>
        <GraphContextProvider>
            <Row gutter={15}>
                <Col span={17}>
                    <Card>
                        <RowFilter />
                        <Divider />
                        <RowTable />
                    </Card>
                </Col>

                <Col span={7}>
                    <Card>
                        <RowGraphs />
                    </Card>
                </Col>
            </Row>
        </GraphContextProvider >
    </RowsContextProvider>
)

export default Rows
