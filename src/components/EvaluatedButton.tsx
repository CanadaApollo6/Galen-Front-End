import React, { useContext } from "react";
import { Button } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { PlateContext } from "../contexts/PlateContext";
import { SampleDetermination } from "../types";
import { RowsContext } from "../containers/Rows/RowsContext";

type EvaluatedButtonProps = { determination: SampleDetermination };

const EvaluatedButton: React.FC<EvaluatedButtonProps> = ({ determination }) => {
    const { determinations, setDeterminations } = useContext(PlateContext);
    const { selected, setSelected, showEvaluated } = useContext(RowsContext);

    const setEvaluated = (evaluated: boolean) => {
        setDeterminations(
            determinations.map((d) =>
                d.well === determination.well
                    ? { ...determination, evaluated }
                    : d
            )
        );
        if (
            determination.well === selected?.well &&
            showEvaluated === "0" &&
            evaluated
        )
            setSelected(undefined);
    };

    return !determination.evaluated ? (
        <Button type="primary" onClick={() => setEvaluated(true)}>
            <CheckOutlined />
        </Button>
    ) : (
        <Button danger type="primary" onClick={() => setEvaluated(false)}>
            <CloseOutlined />
        </Button>
    );
};

export default EvaluatedButton;
