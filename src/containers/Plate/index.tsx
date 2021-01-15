import React, { useContext, useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Button, Modal } from "antd";
import { GraphContextProvider } from "../../contexts/GraphContext";
import { PlateContext } from "../../contexts/PlateContext";
import { SampleDetermination } from "../../types";
import PlateMap from "../../components/PlateMap";
import * as stats from "../../services/StatsService";
import { findIntersects } from "../../services/CTService";
import PlotlyGraph from "../../components/PlotlyGraph";
import AmpButtons from "../../components/AmpButtons";
import DeterminationSelect from "../../components/Inputs/DeterminationSelect";
import ExportButton from "../../components/ExportButton";
import ImportQuantFileButton from "../../components/ImportQuantFileButton";

export default () => {
    const { rns, file, determinations } = useContext(PlateContext);
    const [determination, setDetermination] = useState<SampleDetermination>();
    const [revision, setRevision] = useState<number>(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [elution, setElution] = useState<SampleDetermination[]>([]);
    const statistics = {
        notDetected: determinations.filter(
            (d) => d.determination === "Not Detected"
        ).length,
        detected: determinations.filter(
            (d) =>
                d.determination === "Detected" &&
                d.sample_id !== "neg" &&
                d.sample_id !== "PC"
        ).length,
        repeat: determinations.filter(
            (d) =>
                d.determination === "Repeat" &&
                d.sample_id !== "neg" &&
                d.sample_id !== "PC"
        ).length,
        inconclusive: determinations.filter(
            (d) => d.determination === "Inconclusive"
        ).length,
        invalid: determinations.filter((d) => d.determination === "Invalid")
            .length,
        control: determinations.filter(
            (d) => d.sample_id === "neg" || d.sample_id === "PC"
        ).length,
    };

    const guideLine: number[] = Array(40).fill(50000);
    const noData = Array(40).fill(0);
    const well = determination ? determination.well : "A1";
    const nGeneData = determination ? rns[well]["n_gene_delta"] : noData;
    const sGeneData = determination ? rns[well]["s_gene_delta"] : noData;
    const orf1abData = determination ? rns[well]["orf1ab_delta"] : noData;
    const rpcy5Data = determination ? rns[well]["rp_cy5_delta"] : noData;
    const ms2Data = determination ? rns[well]["ms2_delta"] : noData;

    const marginLeft = 20;

    useEffect(() => {
        setRevision(revision + 1);
        setElution(
            determination
                ? determinations.filter(
                      (d) => d.elution === determination.elution
                  )
                : []
        );
    }, [determination]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <GraphContextProvider>
            <Col>
                <Card style={{ marginBottom: 3 }}>
                    <Row>
                        <Statistic
                            title="Plate"
                            value={
                                file?.name
                                    .match(/\d{6}-COV\d{1,2}-[A-Z]/g)
                                    ?.toString() ?? "No file loaded"
                            }
                        />
                        <Statistic
                            title="Elution"
                            value={" "}
                            style={{ marginLeft }}
                            prefix={
                                <>
                                    <Button type="primary" onClick={showModal}>
                                        View Elution
                                    </Button>
                                    <Modal
                                        title={
                                            determination
                                                ? `Elution ${determination.elution}`
                                                : "Elution"
                                        }
                                        visible={isModalVisible}
                                        onOk={handleOk}
                                        onCancel={handleCancel}
                                        centered={false}
                                    >
                                        <Col>
                                            <Row style={{ marginBottom: 10 }}>
                                                <PlateMap
                                                    samples={elution}
                                                    rowCount={12}
                                                />
                                            </Row>
                                            <Row>
                                                <Statistic
                                                    title="Not Detected (Blue)"
                                                    value={
                                                        elution.filter(
                                                            (d) =>
                                                                d.determination ===
                                                                "Not Detected"
                                                        ).length
                                                    }
                                                    valueStyle={{
                                                        color: "#5ba7c6",
                                                    }}
                                                />
                                                <Statistic
                                                    title="Detected (Red)"
                                                    value={
                                                        elution.filter(
                                                            (d) =>
                                                                d.determination ===
                                                                    "Detected" &&
                                                                d.sample_id !==
                                                                    "neg" &&
                                                                d.sample_id !==
                                                                    "PC"
                                                        ).length
                                                    }
                                                    style={{
                                                        margin:
                                                            "0px 20px 0px 31px",
                                                    }}
                                                    valueStyle={{
                                                        color: "crimson",
                                                    }}
                                                />
                                                <Statistic
                                                    title="Repeat (Yellow)"
                                                    value={
                                                        elution.filter(
                                                            (d) =>
                                                                d.determination ===
                                                                    "Repeat" &&
                                                                d.sample_id !==
                                                                    "neg" &&
                                                                d.sample_id !==
                                                                    "PC"
                                                        ).length
                                                    }
                                                    style={{ margin: "0" }}
                                                    valueStyle={{
                                                        color: "#d7d700",
                                                    }}
                                                />
                                            </Row>
                                            <Row>
                                                <Statistic
                                                    title="Inconclusive (Orange)"
                                                    value={
                                                        elution.filter(
                                                            (d) =>
                                                                d.determination ===
                                                                "Inconclusive"
                                                        ).length
                                                    }
                                                    valueStyle={{
                                                        color: "orange",
                                                    }}
                                                />
                                                <Statistic
                                                    title="Invalid (Purple)"
                                                    value={
                                                        elution.filter(
                                                            (d) =>
                                                                d.determination ===
                                                                "Invalid"
                                                        ).length
                                                    }
                                                    style={{ margin: "0 20px" }}
                                                    valueStyle={{
                                                        color: "mediumpurple",
                                                    }}
                                                />
                                                <Statistic
                                                    title="Controls (Grey)"
                                                    value={
                                                        elution.filter(
                                                            (d) =>
                                                                d.sample_id ===
                                                                    "neg" ||
                                                                d.sample_id ===
                                                                    "PC"
                                                        ).length
                                                    }
                                                    style={{}}
                                                    valueStyle={{
                                                        color: "grey",
                                                    }}
                                                />
                                            </Row>
                                        </Col>
                                    </Modal>
                                </>
                            }
                        />
                        <Statistic
                            title="Well"
                            value={determination ? determination.well : "None"}
                            style={{ marginLeft }}
                        />
                        <Statistic
                            title="Sample ID"
                            value={
                                determination ? determination.sample_id : "None"
                            }
                            style={{ marginLeft }}
                            formatter={(value) => {
                                return value.toString().replaceAll(",", "");
                            }}
                        />
                        <Statistic
                            title="Prediction"
                            value={
                                determination
                                    ? determination.prediction
                                    : "None"
                            }
                            style={{ marginLeft }}
                        />
                        <Statistic
                            title="Confidence"
                            value={
                                determination
                                    ? determination.confidence
                                    : "None"
                            }
                            style={{ marginLeft }}
                        />
                        <Statistic
                            title="Amplifications"
                            prefix={
                                determination ? (
                                    <AmpButtons determination={determination} />
                                ) : (
                                    "None"
                                )
                            }
                            value={" "}
                            style={{ marginLeft }}
                        />
                        <Statistic
                            title="Determination"
                            prefix={
                                determination ? (
                                    <DeterminationSelect
                                        sample={determination}
                                    />
                                ) : (
                                    "None"
                                )
                            }
                            value={" "}
                            style={{ marginLeft }}
                        />
                        <Statistic
                            title="Import/Export"
                            prefix={<ExportButton />}
                            value={" "}
                            style={{ marginLeft }}
                        />
                        <Statistic
                            prefix={<ImportQuantFileButton />}
                            value={" "}
                            style={{ marginLeft: 0, marginTop: 26 }}
                        />
                    </Row>
                </Card>
            </Col>
            <Row gutter={5}>
                <Col span={15}>
                    <Card>
                        <PlateMap
                            samples={determinations}
                            rowCount={24}
                            onSelect={setDetermination}
                            selectedWells={
                                determination ? [determination] : undefined
                            }
                        />
                    </Card>
                    <Card style={{ marginTop: 3 }} size="small">
                        <h1>Statistics</h1>
                        <Row>
                            <Statistic
                                title="Not Detected (Blue)"
                                value={statistics.notDetected}
                                valueStyle={{ color: "#5ba7c6" }}
                            />
                            <Statistic
                                title="Detected (Red)"
                                value={statistics.detected}
                                style={{ margin: "0 20px" }}
                                valueStyle={{ color: "crimson" }}
                            />
                            <Statistic
                                title="Repeat (Yellow)"
                                value={statistics.repeat}
                                valueStyle={{
                                    color: "#d7d700",
                                }}
                            />
                            <Statistic
                                title="Inconclusive (Orange)"
                                value={statistics.inconclusive}
                                style={{ margin: "0 20px" }}
                                valueStyle={{
                                    color: "orange",
                                }}
                            />
                            <Statistic
                                title="Invalid (Purple)"
                                value={statistics.invalid}
                                valueStyle={{ color: "mediumpurple" }}
                            />
                            <Statistic
                                title="Controls (Grey)"
                                value={statistics.control}
                                style={{ margin: "0 20px" }}
                                valueStyle={{ color: "grey" }}
                            />
                        </Row>
                    </Card>
                </Col>

                <Col span={9}>
                    <Card style={{ marginTop: 0 }}>
                        <PlotlyGraph
                            data={{
                                rpcy5Data,
                                ms2Data,
                                nGeneData,
                                sGeneData,
                                orf1abData,
                            }}
                            revision={revision}
                            showLegend={true}
                        />
                    </Card>
                    <Card style={{ marginTop: 3 }} size="small">
                        <h1>CT Values</h1>
                        <Row>
                            <Statistic
                                title="N Gene"
                                value={
                                    findIntersects(guideLine, nGeneData)[0].x
                                }
                            />
                            <Statistic
                                title="S Gene"
                                value={
                                    findIntersects(guideLine, sGeneData)[0].x
                                }
                                style={{ margin: "0 20px" }}
                            />
                            <Statistic
                                title="ORF1ab"
                                value={
                                    findIntersects(guideLine, orf1abData)[0].x
                                }
                            />
                            <Statistic
                                title="MS2"
                                value={findIntersects(guideLine, ms2Data)[0].x}
                                style={{ margin: "0 20px" }}
                            />
                            <Statistic
                                title="RP-Cy5"
                                value={
                                    findIntersects(guideLine, rpcy5Data)[0].x
                                }
                            />
                        </Row>
                    </Card>
                    <Card style={{ marginTop: 3 }} size="small">
                        <h1>Max Values</h1>
                        <Row>
                            <Statistic
                                title="N Gene"
                                value={Math.round(stats.max(nGeneData))}
                            />
                            <Statistic
                                title="S Gene"
                                value={Math.round(stats.max(sGeneData))}
                                style={{ margin: "0 20px" }}
                            />
                            <Statistic
                                title="ORF1ab"
                                value={Math.round(stats.max(orf1abData))}
                            />
                            <Statistic
                                title="MS2"
                                value={Math.round(stats.max(ms2Data))}
                                style={{ margin: "0 20px" }}
                            />
                            <Statistic
                                title="RP-Cy5"
                                value={Math.round(stats.max(rpcy5Data))}
                            />
                        </Row>
                    </Card>
                </Col>
            </Row>
        </GraphContextProvider>
    );
};
