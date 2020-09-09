import React, { useContext } from 'react'
import { Button, Input, Spin } from 'antd'
import QuantExportParser from '../services/QuantExportParser'
import { ImportOutlined } from '@ant-design/icons'
import CovidDetector from '../services/CovidDetector'
import { PlateContext } from '../contexts/PlateContext'
import InvalidDetector from '../services/InvalidDetector'
import { SampleDetermination, SampleRns } from '../types'

const ImportQuantFileButton: React.FC = () => {
    const { setDeterminations, setRns, setFile, file, determinations } = useContext(PlateContext)

    const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        if (!e.target.value) return

        const input = document.getElementById('quant-file') as HTMLInputElement

        if (!input.files) return

        const file = input.files[0]
        setFile(file)
        setDeterminations([])

        const samples = await QuantExportParser(file)

        const invalid_promises = samples.map(async (s) => {
            const [prediction, confidence] = await InvalidDetector(s)

            return { ...s, prediction, confidence, determination: prediction }
        })

        const invalid_resolved = await Promise.all(invalid_promises)

        const sample_prediction_promises = invalid_resolved.map(async (s) => {
            if (s.prediction === 'Repeat') return s

            const [prediction, confidence] = await CovidDetector(s)

            return { ...s, prediction, confidence, determination: prediction }
        })

        const sample_predictions = await Promise.all(sample_prediction_promises)
        const sample_determinations: SampleDetermination[] = sample_predictions
            .map(({ well, id, prediction, confidence }) => ({
                well,
                sample_id: id,
                prediction,
                confidence,
                determination: prediction,
                evaluated: false,
                amplifications: prediction === 'Detected' ? ['S Gene', 'N Gene', 'ORF1ab'] : []
            }))

        const sample_rns: SampleRns = sample_predictions.reduce((acc, val) => ({ ...acc, [val.well]: val.rns }), {})

        setDeterminations(sample_determinations)
        setRns(sample_rns)
    }

    return (
        <Button type='primary' disabled={file && determinations.length === 0}>
            <label>
                <Input id='quant-file' type='file' accept='.txt' className='ant-btn' style={{ display: 'none' }} onChange={onFileSelect} />
                <ImportOutlined /> Import Quant File
                {file && determinations.length === 0 ? <Spin style={{ marginLeft: 15 }} size='small' /> : null}
            </label>
        </Button>
    )
}

export default ImportQuantFileButton
