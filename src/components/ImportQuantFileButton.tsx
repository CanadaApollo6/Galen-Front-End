import React, { useContext, useRef } from "react";
import { Button, Spin } from "antd";
import { ImportOutlined } from "@ant-design/icons";
import { PlateContext } from "../contexts/PlateContext";
import importQuantFile from "../services/ImportQuantFile";

const ImportQuantFileButton: React.FC = () => {
    const {
        setDeterminations,
        setRns,
        setFile,
        file,
        determinations,
    } = useContext(PlateContext);
    const input = useRef<HTMLInputElement>(document.createElement("input"));

    const onFileSelect = async (
        e: React.ChangeEvent<HTMLInputElement>
    ): Promise<void> => {
        if (!input.current.files) return;

        const file = input.current.files[0];

        setFile(file);
        setDeterminations([]);

        const samples = await importQuantFile(file);

        setDeterminations(
            samples.map(
                ({
                    sample_id,
                    determination,
                    prediction,
                    confidence,
                    amplifications,
                    well,
                    evaluated,
                    elution,
                }) => ({
                    sample_id,
                    determination,
                    prediction,
                    confidence,
                    amplifications,
                    well,
                    evaluated,
                    elution,
                })
            )
        );
        setRns(
            samples.reduce(
                (acc, { well, rns }) => ({ ...acc, [well]: rns }),
                {}
            )
        );
    };

    return (
        <Button type="primary" disabled={file && determinations.length === 0}>
            <label>
                <input
                    ref={input}
                    id="quant-file"
                    type="file"
                    accept=".txt"
                    style={{ display: "none" }}
                    onChange={onFileSelect}
                />
                <ImportOutlined /> Import Quant File
                {file && determinations.length === 0 ? (
                    <Spin style={{ marginLeft: 15 }} size="small" />
                ) : null}
            </label>
        </Button>
    );
};

export default ImportQuantFileButton;
