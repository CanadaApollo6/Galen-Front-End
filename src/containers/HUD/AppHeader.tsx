import { PageHeader } from 'antd'
import React, { useContext } from 'react'
import { useLocation } from 'react-router-dom'
import ExportButton from '../../components/ExportButton'
import ImportQuantFileButton from '../../components/ImportQuantFileButton'
import { PlateContext } from '../../contexts/PlateContext'

const AppHeader: React.FC = () => {
    const location = useLocation()
    const { file } = useContext(PlateContext)

    if (location.pathname === '/') return null

    const title = () => {
        switch (location.pathname.split('/')[1]) {
            case 'rows':
                return 'Rows'
            case 'plate':
                return 'Plate'
            case 'elution':
                return 'Elution'
            default:
                return ''
        }
    }

    return (
        <PageHeader
            ghost={false}
            title={title()}
            subTitle={file?.name.match(/\d{6}-COV\d{1,2}-[A-Z]/g) ?? 'No file loaded'}
            style={{ marginBottom: 15 }}
            extra={[<ExportButton />, <ImportQuantFileButton />]}
        />
    )
}

export default AppHeader
