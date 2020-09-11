import React from 'react'
import { Card, Row, Col, PageHeader, Divider } from 'antd'
import ImportQuantFileButton from '../../components/ImportQuantFileButton'
import { GraphContextProvider } from '../../contexts/GraphContext'
import { RowsContextProvider } from './RowsContext'
import ExportButton from '../../components/ExportButton'
import RowTable from './RowTable'
import RowFilter from './RowFilter'
import RowGraphs from './RowGraphs'

const Rows: React.FC = () => (
    <RowsContextProvider>
        <GraphContextProvider>
            <PageHeader ghost={false} title='Row' extra={[<ExportButton />, <ImportQuantFileButton />]} />

            <Row style={{ marginTop: 15 }} gutter={15}>
                <Col span={16}>
                    <Card>
                        <RowFilter />
                        <Divider />
                        <RowTable />
                    </Card>
                </Col>

                <Col span={8}>
                    <Card>
                        <RowGraphs />
                    </Card>
                </Col>
            </Row>
        </GraphContextProvider >
    </RowsContextProvider>
)

export default Rows
