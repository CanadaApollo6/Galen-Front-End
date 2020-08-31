import React, { useContext } from 'react'
import ImportQuantFileButton from '../../components/ImportQuantFileButton'
import { Card, Row, Col, PageHeader, Button, Tabs, Collapse, Form } from 'antd'
import { PlateContextProvider, PlateContext } from '../../contexts/PlateContext'
import { ExportOutlined } from '@ant-design/icons';
import PlateDisplay from '../../components/PlateDisplay'
import RowsDisplay from '../../components/RowsDisplay'
import ListDisplay from '../../components/ListDisplay'
import DeltaRnVsCyclesChart from '../../components/DeltaRnVsCyclesChart'
import GraphTypeSelect from '../../components/Inputs/GraphTypeSelect'
import TargetSelect from '../../components/Inputs/TargetSelect'
import ScaleSelect from '../../components/Inputs/ScaleSelect'

const { TabPane } = Tabs

const SampleContent = () => {
    const { samples } = useContext(PlateContext)

    if (samples.length === 0) return null

    return (
        <Card>
            <Tabs defaultActiveKey="1">
                <TabPane tab="List" key="1">
                    <ListDisplay />
                </TabPane>
                <TabPane tab="Plate" key="2">
                    <PlateDisplay />
                </TabPane>
                <TabPane tab="Row" key="3">
                    <RowsDisplay />
                </TabPane>
            </Tabs>
        </Card>
    )
}

const ChartContent = () => {
    const { activeSamples } = useContext(PlateContext)

    if (!activeSamples) return null

    return (
        <Card>
            <h2>&Delta; Rn vs Cycles</h2>
            <DeltaRnVsCyclesChart />

            <Collapse ghost>
                <Collapse.Panel header='Options' key={1}>
                    <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                        <Row gutter={15}>
                            <Col lg={12}>
                                <Form.Item label='Graph Type'>
                                    <GraphTypeSelect />
                                </Form.Item>
                            </Col>

                            <Col lg={12}>
                                <Form.Item label='Scale'>
                                    <ScaleSelect />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={15}>
                            <Col lg={12}>
                                <Form.Item label='Target'>
                                    <TargetSelect />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Collapse.Panel>
            </Collapse>
        </Card>
    )
}

export default () => (
    <PlateContextProvider>
        <PageHeader ghost={false} title='Plate' extra={[<Button><ExportOutlined /> Export</Button>, <ImportQuantFileButton />]} />

        <Row style={{ marginTop: 15 }} gutter={15}>
            <Col span={14}>
                <SampleContent />
            </Col>
            <Col span={10}>
                <ChartContent />
            </Col>
        </Row>
    </PlateContextProvider>
)
