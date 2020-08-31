import React, { useContext } from 'react'
import { Button, Input } from 'antd'
import QuantExportParser from '../services/QuantExportParser';
import { ImportOutlined } from '@ant-design/icons';
import CovidDetector from '../services/CovidDetector';
import { PlateContext } from '../contexts/PlateContext';

const ImportQuantFileButton: React.FC = () => {
    const { setSamples } = useContext(PlateContext)

    const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        if (!e.target.value) return

        const input = document.getElementById('quant-file') as HTMLInputElement

        if (!input.files) return

        const file = input.files[0]

        const samples = await QuantExportParser(file)

        const sample_prediction_promises = samples.map(async (s) => {
            const [determination, confidence] = await CovidDetector(s)

            return { ...s, determination, confidence }
        })

        setSamples(await Promise.all(sample_prediction_promises))
    }

    return (
        <Button type='primary'>
            <label>
                <Input id='quant-file' type='file' accept='.txt' className='ant-btn' style={{ display: 'none' }} onChange={onFileSelect} />
                <ImportOutlined /> Import Quant File
            </label>
        </Button>
    )
}

export default ImportQuantFileButton
