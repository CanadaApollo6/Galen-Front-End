import React, { useContext } from 'react'
import { Row, Col, Form, Select } from 'antd'
import { RowsContext } from './RowsContext'
import PlateProgress from '../../components/PlateProgress'

const RowFilter = () => {
    const { rows, setRow, showEvaluated, setShowEvaluated } = useContext(RowsContext)

    return (
        <Form>
            <Row gutter={15}>
                <Col span={8}>
                    <Form.Item label='Row'>
                        <Select onChange={(v) => setRow(v.toString())}>
                            {rows.map(r => <Select.Option value={r}>{r}</Select.Option>)}
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item label='Show Evaluated'>
                        <Select defaultValue={showEvaluated} onChange={setShowEvaluated}>
                            <Select.Option value='1'>Yes</Select.Option>
                            <Select.Option value='0'>No</Select.Option>
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
