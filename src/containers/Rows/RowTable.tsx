import React, { useContext } from "react";
import { Table, Tooltip } from "antd";
import DeterminationSelect from "../../components/Inputs/DeterminationSelect";
import { SampleDetermination } from "../../types";
import { RowsContext } from "./RowsContext";
import EvaluatedButton from "../../components/EvaluatedButton";
import AmpButtons from "../../components/AmpButtons";
import { ColumnsType } from "antd/lib/table";

const columns: ColumnsType<SampleDetermination> = [
    {
        title: "Well",
        dataIndex: "well",
        key: "well",
        width: 75,
        sorter: (a: SampleDetermination, b: SampleDetermination) =>
            parseInt(a.well.substring(1, 3)) - parseInt(b.well.substring(1, 3)),
    },
    {
        title: "Sample ID",
        dataIndex: "sample_id",
        key: "sample_id",
        width: 110,
        sorter: (a: SampleDetermination, b: SampleDetermination) =>
            a.sample_id?.localeCompare(b.sample_id || "") || 0,
    },
    {
        title: "Prediction",
        dataIndex: "prediction",
        key: "prediction",
        width: 100,
        render: (
            prediction: string,
            { confidence: c }: SampleDetermination
        ) => (
            <Tooltip title={`Confidence: ${(c * 100).toFixed(2)}%`}>
                <span>{prediction}</span>
            </Tooltip>
        ),
        sorter: (a: SampleDetermination, b: SampleDetermination) =>
            a.prediction?.localeCompare(b.prediction || "") || 0,
        onFilter: (
            value: string | number | boolean,
            record: SampleDetermination
        ) => record.prediction?.indexOf(value.toString()) === 0 || false,
    },
    {
        title: "Conf",
        dataIndex: "confidence",
        key: "confidence",
        width: 80,
        sorter: (a: SampleDetermination, b: SampleDetermination) =>
            a.confidence - b.confidence,
    },
    {
        title: "Amplified",
        dataIndex: "amplifications",
        key: "amplifications",
        width: 260,
        render: (w: string, determination: SampleDetermination) => (
            <AmpButtons determination={determination} />
        ),
        sorter: (a: SampleDetermination, b: SampleDetermination) =>
            b.amplifications.length - a.amplifications.length,
    },
    {
        title: "Determination",
        dataIndex: "determination",
        key: "determination",
        width: 150,
        render: (x: string, determination: SampleDetermination) => (
            <DeterminationSelect sample={determination} />
        ),
        sorter: (a: SampleDetermination, b: SampleDetermination) =>
            a.determination?.localeCompare(b.determination || "") || 0,
        onFilter: (
            value: string | number | boolean,
            record: SampleDetermination
        ) => record.determination?.indexOf(value.toString()) === 0 || false,
    },
    {
        title: "Approve?",
        dataIndex: "well",
        key: "well",
        width: 125,
        render: (x: string, determination: SampleDetermination) => (
            <EvaluatedButton determination={determination} />
        ),
    },
];

const RowTable = () => {
    const {
        determinations,
        selected,
        setSelected,
        setRevision,
        revision,
    } = useContext(RowsContext);

    return (
        <Table
            rowKey="well"
            columns={columns}
            dataSource={determinations}
            rowSelection={{
                type: "radio",
                selectedRowKeys: selected ? [selected.well] : [],
                onSelect: (selected) => {
                    setSelected(selected);
                    setRevision(revision + 1);
                },
            }}
            pagination={{ pageSize: 25 }}
            scroll={{ y: 600 }}
        />
    );
};

export default RowTable;
