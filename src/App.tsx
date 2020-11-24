import React from "react";
import { HUD } from "./containers/HUD";
import { PlateContextProvider } from "./contexts/PlateContext";
import { BrowserRouter as Router } from "react-router-dom";
import "antd/dist/antd.css";

const App = () => (
    <PlateContextProvider>
        <Router>
            <HUD />
        </Router>
    </PlateContextProvider>
);

export default App;
