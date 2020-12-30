import React from "react";
import { Layout } from "antd";
import { Route } from "react-router-dom";
import Plate from "../Plate";

const { Content, Footer } = Layout;

export const HUD: React.FC = () => {
    return (
        <Layout
            className="layout"
            style={{ height: "100vh", overflowY: "scroll" }}
        >
            <Content
                style={{ padding: "0 30px", marginTop: 10 }}
                className="site-layout"
            >
                <Route path="/" component={Plate} />

                <Footer style={{ textAlign: "center" }}>
                    Gravity Diagnostics ©2020
                </Footer>
            </Content>
        </Layout>
    );
};
