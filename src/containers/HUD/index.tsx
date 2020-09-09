import React from 'react'
import { Layout, Menu } from 'antd'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Home from '../Home'
import { PlateContextProvider } from '../../contexts/PlateContext'
import Plate from '../Plate'
import Rows from '../Rows'

const { Header, Content, Footer } = Layout;

export const AppRouter = () => (

    <Switch>
        <Route path='/' exact={true} component={Home} />
        <Route path='/plate' component={Plate} />
        <Route path='/rows' component={Rows} />
    </Switch>

)

export const HUD: React.FC = () => (
    <PlateContextProvider>
        <Router>
            <Layout className="layout" style={{ height: '100%' }}>
                <Header className='header' style={{ backgroundColor: 'rgb(89, 89, 89)', position: 'fixed', zIndex: 1, width: '100%' }}>
                    <div className='logo' style={{ float: 'left' }}>
                        <img src="logo.svg" alt="" style={{ height: 50, padding: 5 }} />
                    </div>
                    <div style={{ float: 'left', marginLeft: 30 }}>
                        <Menu theme="dark" mode="horizontal" style={{ backgroundColor: 'rgb(89, 89, 89)' }} defaultSelectedKeys={['2']}>
                            <Menu.Item key="1">
                                <Link to='plate'>Plate</Link>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Link to='rows'>Rows</Link>
                            </Menu.Item>
                        </Menu>
                    </div>
                </Header>

                <Content style={{ padding: '0 30px', marginTop: 94 }} className="site-layout">
                    <div className='site-layout-background'>
                        <AppRouter />
                    </div>
                </Content>

                <Footer style={{ textAlign: 'center' }}>Gravity Diagnostics ©2020</Footer>
            </Layout>
        </Router>
    </PlateContextProvider>
)
