import React, { useContext } from "react";
import { Select } from "antd";
import { GraphContext } from "../../contexts/GraphContext";

export const ContextScaleSelect: React.FC = () => {
    const { scale, setScale, scales } = useContext(GraphContext);

    return (
        <Select value={scale} onChange={setScale}>
            {scales?.map((s) => (
                <Select.Option value={s}>{s}</Select.Option>
            ))}
        </Select>
    );
};
