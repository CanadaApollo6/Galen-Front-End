import React from 'react'
import { Result, Card } from 'antd'
import ImportQuantFileButton from '../../components/ImportQuantFileButton'
import { EyeOutlined } from '@ant-design/icons'

const Home = () => {
    return (
        <Card>
            <Result
                status='error'
                icon={<EyeOutlined />}
                title='Sauron'
                subTitle='Smarter SARS-CoV-2 Reporting and Detection'
                extra={[<ImportQuantFileButton />]}
            />
        </Card>
    )
}

export default Home
