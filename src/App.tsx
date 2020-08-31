import React from 'react';
import { Layout, Menu } from 'antd';
import 'antd/dist/antd.css';
import Plate from './containers/Plate';

const { Header, Content, Footer } = Layout;

const App = () => (
  <Layout className="layout">
    <Header style={{ backgroundColor: 'rgb(89, 89, 89)' }}>
      <div className="logo">
        <img src="logo.svg" alt="" height="50px" style={{ padding: 5 }} />
      </div>
      <Menu theme="light" mode="horizontal"></Menu>
    </Header>
    <Content style={{ padding: 15 }}>
      <div className="site-layout-content">
        <Plate />
      </div>
    </Content>
    <Footer style={{ textAlign: 'center' }}>Gravity Diagnostics ©2020</Footer>
  </Layout>
)

export default App
