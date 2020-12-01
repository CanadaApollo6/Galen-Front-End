import React, { useContext } from 'react'
import { Row, Col, Form, Select, Badge } from 'antd'
import { RowsContext } from './RowsContext'
import PlateProgress from '../../components/PlateProgress'

const RowFilter = () => {
    const { rows, row, setRow, showEvaluated, setShowEvaluated } = useContext(
        RowsContext
    )

    return (
        <Form>
            <Row gutter={15}>
                <Col span={8}>
                    <Form.Item label="Display Row">
                        <Select
                            value={row}
                            onChange={(v) => setRow(v.toString())}
                            placeholder="Select Row..."
                        >
                            {rows.map(([r, n]) => (
                                <Select.Option value={r}>
                                    <div style={{ float: 'left' }}>
                                        <span>{r}</span>
                                    </div>
                                    <div style={{ float: 'right' }}>
                                        <Badge count={n} />
                                    </div>
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item label="Show Evaluated">
                        <Select
                            defaultValue={showEvaluated}
                            onChange={setShowEvaluated}
                        >
                            <Select.Option value="1">Yes</Select.Option>
                            <Select.Option value="0">No</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <PlateProgress />
                </Col>
            </Row>
        </Form>
    )
}

export default RowFilter
