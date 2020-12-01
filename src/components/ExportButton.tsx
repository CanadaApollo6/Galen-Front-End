import React, { useContext } from 'react'
import { Button } from 'antd'
import { ExportOutlined } from '@ant-design/icons'
import { PlateContext } from '../contexts/PlateContext'
import { parseCsvContent } from '../services/ExportForHavest'

const ExportButton: React.FC = () => {
    const { determinations } = useContext(PlateContext)
    const content = encodeURIComponent(parseCsvContent(determinations))

    return (
        <Button
            href={`data:text/plain;charset=utf-8,${content}`}
            download="to_harvest.csv"
        >
            <ExportOutlined /> Export
        </Button>
    )
}

export default ExportButton
