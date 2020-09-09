import React, { useContext } from 'react'
import { Button, Spin } from 'antd'
import { AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { PlateContext } from '../contexts/PlateContext'
import { useHistory } from 'react-router-dom'

const PlateMapButton = () => {
    const history = useHistory()

    return <Button onClick={() => history.push('/plate')}><AppstoreOutlined /> Plate Map</Button>
}

const RowsButton = () => {
    const history = useHistory()

    return <Button onClick={() => history.push('/rows')}><UnorderedListOutlined /> Rows</Button>
}

const InitialNav = () => {
    const { file, determinations } = useContext(PlateContext)

    console.log(file, determinations)

    if (!file) return null
    if (determinations.length === 0) return <Spin />

    return (
        <>
            <div style={{ display: 'inline', marginRight: 15 }}>
                <PlateMapButton />
            </div>

            <div style={{ display: 'inline' }}>
                <RowsButton />
            </div>
        </>
    )
}

export default InitialNav
