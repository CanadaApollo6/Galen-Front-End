import React from 'react'
import { Result, Card } from 'antd'
import ImportQuantFileButton from '../../components/ImportQuantFileButton'
import { EyeOutlined } from '@ant-design/icons'
import InitialNav from '../../components/InitialNav'

const Home = () => {
    return (
        <Card>
            <Result
                status="error"
                icon={<EyeOutlined />}
                title="Sauron"
                subTitle="Smarter SARS-CoV-2 Reporting and Detection"
                extra={[<ImportQuantFileButton />]}
            />

            <div style={{ textAlign: 'center', marginBottom: 30 }}>
                <InitialNav />
            </div>
        </Card>
    )
}

export default Home
