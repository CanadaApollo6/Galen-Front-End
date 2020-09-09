import React, { useContext, useState } from 'react'
import { Card, Row, Col, PageHeader } from 'antd'
import { ContextGraphOptions } from '../../components/GraphOptions';
import ImportQuantFileButton from '../../components/ImportQuantFileButton'
import { AmpChart } from '../../components/AmpChart';
import { GraphContextProvider } from '../../contexts/GraphContext';
import { PlateContext } from '../../contexts/PlateContext'
import { SampleDetermination } from '../../types';
import ExportButton from '../../components/ExportButton';

type PlateRowProps = { determination: SampleDetermination | undefined, setDetermination: React.Dispatch<SampleDetermination>, row: string }

const PlateRow: React.FC<PlateRowProps> = ({ row, determination, setDetermination }) => {
    const { determinations } = useContext(PlateContext)
    const r = determinations.filter(s => s.well.includes(row))

    const getColor = (d: SampleDetermination): string => {
        if (d.well === determination?.well) return 'blue'
        if (d.prediction === 'Detected') return 'red'
        if (d.prediction === 'Repeat') return 'yellow'

        return ''
    }

    return (
        <Row>
            {r.map(d =>
                <Col xs={1} onClick={() => setDetermination(d)}>
                    <div style={{ border: '1px solid #d9d9d9', textAlign: 'center', background: getColor(d), padding: '5px 0 5px' }}>
                        {d.well}
                    </div>
                </Col>
            )}
        </Row>
    )
}

type PlateMapProps = { determination: SampleDetermination | undefined, setDetermination: React.Dispatch<SampleDetermination> }

const PlateMap: React.FC<PlateMapProps> = ({ determination, setDetermination }) => {
    const { determinations } = useContext(PlateContext)
    const rows = determinations.reduce((acc, val) => acc.add(val.well.replace(/\d+/g, '')), new Set<string>())

    return <>{Array.from(rows).map(r => <PlateRow row={r} determination={determination} setDetermination={setDetermination} />)}</>
}

export default () => {
    const [determination, setDetermination] = useState<SampleDetermination>()

    return (
        <GraphContextProvider>
            <PageHeader ghost={false} title='Plate' extra={[<ExportButton />, <ImportQuantFileButton />]} />

            <Row style={{ marginTop: 15 }} gutter={15}>
                <Col span={16}>
                    <Card>
                        <PlateMap determination={determination} setDetermination={setDetermination} />
                    </Card>
                </Col>

                <Col span={8}>
                    <Card>
                        <ContextGraphOptions />
                        <AmpChart determinations={determination ? [determination] : []} />
                    </Card>
                </Col>
            </Row>
        </GraphContextProvider>
    )
}
