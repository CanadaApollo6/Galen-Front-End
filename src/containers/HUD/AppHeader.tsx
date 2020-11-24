import { PageHeader, Statistic, Row } from 'antd';
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

    if (title() === 'Rows') {
        return (
            <PageHeader 
                ghost={false}
                title={title()}
                subTitle={file?.name.match(/\d{6}-COV\d{1,2}-[A-Z]/g) ?? 'No file loaded'}
                style={{ marginBottom: 15 }}
                extra={[<ExportButton />, <ImportQuantFileButton />]}>
                    <Row>
                        <Statistic title="N Gene" value="Blue" />
                        <Statistic title="S Gene" value="Green" style={{ margin: '0 32px' }} />
                        <Statistic title="ORF1ab" value="Red" />
                        <Statistic title="MS2" value="Orange" style={{ margin: '0 32px' }}/>
                        <Statistic title="RP-Cy5" value="Maroon"/>
                        <Statistic title="50K Guide" value="Black" style={{ margin: '0 32px' }}/>
                    </Row>
            </PageHeader>
        )
    }

    return (
        <PageHeader 
            ghost={false}
            title={title()}
            subTitle={file?.name.match(/\d{6}-COV\d{1,2}-[A-Z]/g) ?? 'No file loaded'}
            style={{ marginBottom: 15 }}
            extra={[<ExportButton />, <ImportQuantFileButton />]}>
                <Row>
                    <Statistic title="Not Detected" value="Blue" />
                    <Statistic title="Detected" value="Red" style={{ margin: '0 32px' }} />
                    <Statistic title="Repeat" value="Yellow" />
                    <Statistic title="Inconclusive" value="Orange" style={{ margin: '0 32px' }}/>
                    <Statistic title="Invalid" value="Purple"/>
                    <Statistic title="Control" value="Grey" style={{ margin: '0 32px' }}/>
                </Row>
        </PageHeader>
            
    )
}

export default AppHeader
