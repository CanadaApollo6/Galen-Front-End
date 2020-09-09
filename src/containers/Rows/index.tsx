import React, { useContext } from 'react'
import { Card, Row, Col, PageHeader, Divider } from 'antd'
import ImportQuantFileButton from '../../components/ImportQuantFileButton'
import { AmpChart } from '../../components/AmpChart';
import { GraphContextProvider } from '../../contexts/GraphContext';
import { ContextGraphOptions } from '../../components/GraphOptions';
import { RowsContext, RowsContextProvider } from './RowsContext';
import ExportButton from '../../components/ExportButton';
import RowTable from './RowTable';
import RowFilter from './RowFilter';

const Graphs = () => {
    const { determinations, selected, row } = useContext(RowsContext)

    return (
        <>
            <ContextGraphOptions />

            <h2>Row - {row}</h2>
            <AmpChart determinations={determinations} />

            <h2>Sample - {selected?.well} ({selected?.sample_id})</h2>
            <AmpChart determinations={selected ? [selected] : []} />
        </>
    )
}

export default () => {
    return (
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
                            <Graphs />
                        </Card>
                    </Col>
                </Row>
            </GraphContextProvider >
        </RowsContextProvider>
    )
}
