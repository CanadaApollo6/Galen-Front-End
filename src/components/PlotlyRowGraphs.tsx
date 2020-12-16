import React, { useEffect } from "react";
import Plotly, { Data, Layout } from "plotly.js";
import createPlotlyComponent from "react-plotly.js/factory";
import { Col, Row, Select, Form } from "antd";
import _ from "lodash";
import { RowsContext } from "../containers/Rows/RowsContext";
import { PlateContext } from "../contexts/PlateContext";

type GraphTarget = "All" | "Rp-Cy5" | "MS2" | "N Gene" | "S Gene" | "ORF1ab";
type RowGraphProps = {
    showLegend: boolean;
};
const Plot = createPlotlyComponent(Plotly);
const PlotlyRowGraphs: React.FC<RowGraphProps> = ({ showLegend }) => {
    const { revision } = React.useContext(RowsContext);
    const { rns } = React.useContext(PlateContext);
    const { selected, determinations } = React.useContext(RowsContext);
    const [traces, setTraces] = React.useState<Data[]>([]);
    const [rowTraces, setRowTraces] = React.useState<Data[][]>([]);
    const [layout, setLayout] = React.useState<Partial<Layout>>({
        title: "Selected Sample(s)",
        xaxis: { title: "Cycle" },
        yaxis: { title: "Delta RN", type: "linear" },
        showlegend: showLegend,
    });
    const [target, setTarget] = React.useState<GraphTarget>("All");

    const noData: number[] = Array(40).fill(0);
    const well = selected ? selected.well : "A1";
    const nGeneData = selected ? rns[well]["n_gene_delta"] : noData;
    const sGeneData = selected ? rns[well]["s_gene_delta"] : noData;
    const orf1abData = selected ? rns[well]["orf1ab_delta"] : noData;
    const rpcy5Data = selected ? rns[well]["rp_cy5_delta"] : noData;
    const ms2Data = selected ? rns[well]["ms2_delta"] : noData;

    const nGeneRowData = determinations.map((d) => {
        return rns[d.well]["n_gene_delta"];
    });
    const sGeneRowData = determinations.map((d) => {
        return rns[d.well]["s_gene_delta"];
    });
    const orf1abRowData = determinations.map((d) => {
        return rns[d.well]["orf1ab_delta"];
    });
    const rpcy5RowData = determinations.map((d) => {
        return rns[d.well]["rp_cy5_delta"];
    });
    const ms2RowData = determinations.map((d) => {
        return rns[d.well]["ms2_delta"];
    });

    const type = "scatter";
    const mode = "lines";
    const shape = "spline";

    const x = Array(40)
        .fill(0)
        .map((x, i) => {
            i++;
            return i;
        });
    const guideLine: number[] = Array(40).fill(50000);

    const guideTrace: Data = {
        x,
        y: guideLine,
        type,
        mode: "lines",
        name: "50K Guide",
        line: {
            dash: "dot",
            width: 4,
            color: "black",
        },
    };

    const rpcy5Trace: Data = {
        x,
        y: rpcy5Data,
        name: "Rp-Cy5",
        type,
        mode,
        marker: { color: "brown" },
        line: { shape },
    };

    const ms2Trace: Data = {
        x,
        y: ms2Data,
        name: "MS2",
        type,
        mode,
        marker: { color: "orange" },
        line: { shape },
    };

    const nGeneTrace: Data = {
        x,
        y: nGeneData,
        name: "N Gene",
        type,
        mode,
        marker: { color: "blue" },
        line: { shape },
    };

    const sGeneTrace: Data = {
        x,
        y: sGeneData,
        name: "S Gene",
        type,
        mode,
        marker: { color: "green" },
        line: { shape },
    };

    const orf1abTrace: Data = {
        x,
        y: orf1abData,
        name: "ORF1ab",
        type,
        mode,
        marker: { color: "red" },
        line: { shape },
    };

    const rpcy5RowTraces: Data[] = rpcy5RowData.map((data) => {
        return {
            x,
            y: data,
            name: "Rp-Cy5",
            type,
            mode,
            marker: { color: "brown" },
            line: { shape },
        };
    });

    const ms2RowTraces: Data[] = ms2RowData.map((data) => {
        return {
            x,
            y: data,
            name: "MS2",
            type,
            mode,
            marker: { color: "orange" },
            line: { shape },
        };
    });

    const nGeneRowTraces: Data[] = nGeneRowData.map((data) => {
        return {
            x,
            y: data,
            name: "N Gene",
            type,
            mode,
            marker: { color: "blue" },
            line: { shape },
        };
    });

    const sGeneRowTraces: Data[] = sGeneRowData.map((data) => {
        return {
            x,
            y: data,
            name: "S Gene",
            type,
            mode,
            marker: { color: "green" },
            line: { shape },
        };
    });

    const orf1abRowTraces: Data[] = orf1abRowData.map((data) => {
        return {
            x,
            y: data,
            name: "ORF1ab",
            type,
            mode,
            marker: { color: "red" },
            line: { shape },
        };
    });

    useEffect(() => {
        if (target === "All") {
            setTraces([
                guideTrace,
                rpcy5Trace,
                ms2Trace,
                nGeneTrace,
                sGeneTrace,
                orf1abTrace,
            ]);
            setRowTraces([
                [guideTrace],
                rpcy5RowTraces,
                ms2RowTraces,
                nGeneRowTraces,
                sGeneRowTraces,
                orf1abRowTraces,
            ]);
        }
        if (target === "Rp-Cy5") {
            setTraces([guideTrace, rpcy5Trace]);
            setRowTraces([[guideTrace], rpcy5RowTraces]);
        }
        if (target === "MS2") {
            setTraces([guideTrace, ms2Trace]);
            setRowTraces([[guideTrace], ms2RowTraces]);
        }
        if (target === "N Gene") {
            setTraces([guideTrace, nGeneTrace]);
            setRowTraces([[guideTrace], nGeneRowTraces]);
        }
        if (target === "S Gene") {
            setTraces([guideTrace, sGeneTrace]);
            setRowTraces([[guideTrace], sGeneRowTraces]);
        }
        if (target === "ORF1ab") {
            setTraces([guideTrace, orf1abTrace]);
            setRowTraces([[guideTrace], orf1abRowTraces]);
        }
    }, [target, revision]);

    return (
        <Col>
            <Row>
                <Form style={{ paddingBottom: 0 }}>
                    <Row style={{ width: "40vw" }}>
                        <Form.Item label="Graph: ">
                            <Select
                                value={layout.yaxis?.type}
                                onSelect={(v) => {
                                    if (v === "log") {
                                        setLayout({
                                            title: "Selected Sample(s)",
                                            yaxis: {
                                                type: "log",
                                                title: "Delta RN",
                                            },
                                            xaxis: { title: "Cycle" },
                                            showlegend: showLegend,
                                        });
                                    }
                                    if (v === "linear") {
                                        setLayout({
                                            title: "Selected Sample(s)",
                                            yaxis: {
                                                type: "linear",
                                                title: "Delta RN",
                                            },
                                            xaxis: { title: "Cycle" },
                                            showlegend: showLegend,
                                        });
                                    }
                                }}
                                style={{ width: "10em", paddingRight: 5 }}
                            >
                                <Select.Option value="linear">
                                    Linear
                                </Select.Option>
                                <Select.Option value="log">
                                    Logarithmic
                                </Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Target: " style={{ paddingLeft: 10 }}>
                            <Select
                                value={target}
                                onSelect={(v) => {
                                    setTarget(v);
                                }}
                                style={{ width: "10em" }}
                            >
                                <Select.Option value="All">All</Select.Option>
                                <Select.Option value="Rp-Cy5">
                                    Rp-Cy5
                                </Select.Option>
                                <Select.Option value="MS2">MS2</Select.Option>
                                <Select.Option value="N Gene">
                                    N Gene
                                </Select.Option>
                                <Select.Option value="S Gene">
                                    S Gene
                                </Select.Option>
                                <Select.Option value="ORF1ab">
                                    ORF1ab
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    </Row>
                </Form>
            </Row>
            <Plot
                data={traces}
                layout={layout}
                divId={"plotly-row-graph"}
                revision={revision}
                style={{ width: "25vw" }}
                config={{
                    modeBarButtonsToRemove: [
                        "lasso2d",
                        "select2d",
                        "toggleSpikelines",
                        "resetScale2d",
                    ],
                    displaylogo: false,
                }}
            ></Plot>
            <Plot
                data={_.flatten(rowTraces)}
                layout={layout}
                revision={revision}
                style={{ width: "25vw" }}
                config={{
                    modeBarButtonsToRemove: [
                        "lasso2d",
                        "select2d",
                        "toggleSpikelines",
                        "resetScale2d",
                    ],
                    displaylogo: false,
                }}
            ></Plot>
        </Col>
    );
};

export default PlotlyRowGraphs;
