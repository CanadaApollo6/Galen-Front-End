import React from "react";
import { Layout, Menu } from "antd";
import { Switch, Route, Link, useHistory, useLocation } from "react-router-dom";
import Home from "../Home";
import Plate from "../Plate";
import Rows from "../Rows";
import Elution from "../Elution";
import AppHeader from "./AppHeader";

const { Header, Content, Footer } = Layout;

export const AppRouter = () => (
    <Switch>
        <Route path="/" exact={true} component={Home} />
        <Route path="/plate" component={Plate} />
        <Route path="/rows" component={Rows} />
        <Route path="/elution" component={Elution} />
    </Switch>
);

export const HUD: React.FC = () => {
    const history = useHistory();

    return (
        <Layout
            className="layout"
            style={{ height: "100vh", overflowY: "scroll" }}
        >
            <Header
                className="header"
                style={{
                    backgroundColor: "rgb(89, 89, 89)",
                    position: "fixed",
                    zIndex: 1,
                    width: "100%",
                }}
            >
                <div
                    className="logo"
                    style={{ float: "left" }}
                    onClick={() => history.push("/")}
                >
                    <img
                        src="logo.svg"
                        alt=""
                        style={{ height: 50, padding: 5 }}
                    />
                </div>
                <div style={{ float: "left", marginLeft: 30 }}>
                    <Navigation />
                </div>
            </Header>

            <Content
                style={{ padding: "0 30px", marginTop: 79 }}
                className="site-layout"
            >
                <AppHeader />

                <AppRouter />

                <Footer style={{ textAlign: "center" }}>
                    Gravity Diagnostics ©2020
                </Footer>
            </Content>
        </Layout>
    );
};

const Navigation: React.FC = () => {
    const location = useLocation();
    const select = location.pathname.split("/")[1];

    return (
        <Menu
            theme="dark"
            mode="horizontal"
            style={{ backgroundColor: "rgb(89, 89, 89)" }}
            selectedKeys={[select]}
        >
            <Menu.Item key="plate">
                <Link to="plate">Plate</Link>
            </Menu.Item>
            <Menu.Item key="elution">
                <Link to="elution">Elution</Link>
            </Menu.Item>
            <Menu.Item key="rows">
                <Link to="rows">Rows</Link>
            </Menu.Item>
        </Menu>
    );
};
