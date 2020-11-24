import React from 'react'
import { Row, Col, Form } from 'antd'
import { ContextTargetSelect } from './Inputs/TargetSelect'
import { ContextGraphTypeSelect } from './Inputs/GraphTypeSelect'
//import { ContextScaleSelect } from './Inputs/ScaleSelect'

export const ContextGraphOptions: React.FC = () =>
    <Form>
        <Row gutter={15}>
            <Col span={12}>
                <Form.Item label='Target'>
                    <ContextTargetSelect />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item label='Type'>
                    <ContextGraphTypeSelect />
                </Form.Item>
            </Col>

            {/* <Col span={8}>
                <Form.Item label='Scale'>
                    <ContextScaleSelect />
                </Form.Item>
            </Col> */}
        </Row>
    </Form>
