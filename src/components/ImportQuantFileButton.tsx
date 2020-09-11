import React, { useContext } from 'react'
import { Button, Input, Spin } from 'antd'
import { ImportOutlined } from '@ant-design/icons'
import { PlateContext } from '../contexts/PlateContext'
import importQuantFile from '../services/ImportQuantFile'

const ImportQuantFileButton: React.FC = () => {
    const { setDeterminations, setRns, setFile, file, determinations } = useContext(PlateContext)

    const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        if (!e.target.value) return

        const input = document.getElementById('quant-file') as HTMLInputElement

        if (!input.files) return

        const file = input.files[0]
        setFile(file)
        setDeterminations([])

        const samples = await importQuantFile(file)

        setDeterminations(samples.map(({ sample_id, determination, prediction, confidence, amplifications, well, evaluated }) =>
            ({ sample_id, determination, prediction, confidence, amplifications, well, evaluated })))

        setRns(samples.reduce((acc, { well, rns }) => ({ ...acc, [well]: rns }), {}))
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
