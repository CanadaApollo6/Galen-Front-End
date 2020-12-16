import React, { useEffect } from "react";
import Plotly, { Data, Layout } from "plotly.js";
import createPlotlyComponent from "react-plotly.js/factory";
import { Row, Select, Form } from "antd";

type GraphTarget = "All" | "Rp-Cy5" | "MS2" | "N Gene" | "S Gene" | "ORF1ab";
type GraphProps = {
    data: {
        rpcy5Data: number[];
        ms2Data: number[];
        nGeneData: number[];
        sGeneData: number[];
        orf1abData: number[];
    };
    revision: number;
    title: string;
    showLegend: boolean;
};
const Plot = createPlotlyComponent(Plotly);
const PlotlyGraph: React.FC<GraphProps> = ({ data, revision, showLegend }) => {
    const [traces, setTraces] = React.useState<Data[]>([]);
    const [layout, setLayout] = React.useState<Partial<Layout>>({
        title: "Selected Sample",
        xaxis: { title: "Cycle" },
        yaxis: { title: "Delta RN", type: "linear" },
        showlegend: showLegend,
        legend: { orientation: "h", y: -0.25 },
    });
    const [target, setTarget] = React.useState<GraphTarget>("All");

    const type = "scatter";
    const mode = "lines";
    const shape = "spline";
    // Comment

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
        y: data.rpcy5Data,
        name: "Rp-Cy5",
        type,
        mode,
        marker: { color: "brown" },
        line: { shape },
    };

    const ms2Trace: Data = {
        x,
        y: data.ms2Data,
        name: "MS2",
        type,
        mode,
        marker: { color: "orange" },
        line: { shape },
    };

    const nGeneTrace: Data = {
        x,
        y: data.nGeneData,
        name: "N Gene",
        type,
        mode,
        marker: { color: "blue" },
        line: { shape },
    };

    const sGeneTrace: Data = {
        x,
        y: data.sGeneData,
        name: "S Gene",
        type,
        mode,
        marker: { color: "green" },
        line: { shape },
    };

    const orf1abTrace: Data = {
        x,
        y: data.orf1abData,
        name: "ORF1ab",
        type,
        mode,
        marker: { color: "red" },
        line: { shape },
    };
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
        }
        if (target === "Rp-Cy5") {
            setTraces([guideTrace, rpcy5Trace]);
        }
        if (target === "MS2") {
            setTraces([guideTrace, ms2Trace]);
        }
        if (target === "N Gene") {
            setTraces([guideTrace, nGeneTrace]);
        }
        if (target === "S Gene") {
            setTraces([guideTrace, sGeneTrace]);
        }
        if (target === "ORF1ab") {
            setTraces([guideTrace, orf1abTrace]);
        }
    }, [target, data]);

    return (
        <div>
            <Row>
                <Form style={{ paddingBottom: 0 }}>
                    <Row>
                        <Form.Item label="Graph: ">
                            <Select
                                value={layout.yaxis?.type}
                                onSelect={(v) => {
                                    if (v === "log") {
                                        setLayout({
                                            yaxis: {
                                                type: "log",
                                                title: "Delta RN",
                                            },
                                            xaxis: { title: "Cycle" },
                                            legend: {
                                                orientation: "h",
                                                y: -0.25,
                                            },
                                        });
                                    }
                                    if (v === "linear") {
                                        setLayout({
                                            yaxis: {
                                                type: "linear",
                                                title: "Delta RN",
                                            },
                                            xaxis: { title: "Cycle" },
                                            legend: {
                                                orientation: "h",
                                                y: -0.25,
                                            },
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
                divId={"plotly-graph"}
                revision={revision}
                config={{
                    modeBarButtonsToRemove: [
                        "lasso2d",
                        "select2d",
                        "toggleSpikelines",
                        "resetScale2d",
                    ],
                    displaylogo: false,
                    scrollZoom: true,
                }}
                style={{ width: "33.5vw", height: "47vh" }}
            ></Plot>
        </div>
    );
};

export default PlotlyGraph;
