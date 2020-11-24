import React, { useContext } from "react";
import { PlateContext } from "../contexts/PlateContext";
import { Progress } from "antd";

const PlateProgress: React.FC = () => {
    const { determinations } = useContext(PlateContext);

    const percent = Math.floor(
        (determinations.filter((d) => d.evaluated).length /
            determinations.length) *
            100
    );

    return <Progress percent={percent} />;
};

export default PlateProgress;
