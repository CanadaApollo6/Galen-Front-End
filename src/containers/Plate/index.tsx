import React, { useContext, useEffect, useState } from "react";
import { Card, Row, Col, Statistic } from "antd";
import { GraphContextProvider } from "../../contexts/GraphContext";
import { PlateContext } from "../../contexts/PlateContext";
import { SampleDetermination } from "../../types";
import PlateMap from "../../components/PlateMap";
import * as stats from "../../services/StatsService";
import { findIntersects } from "../../services/CTService";
import PlotlyGraph from "../../components/PlotlyGraph";

export default () => {
    const { rns } = useContext(PlateContext);
    const { determinations } = useContext(PlateContext);
    const [determination, setDetermination] = useState<SampleDetermination>();
    const [revision, setRevision] = useState<number>(0);
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
    useEffect(() => {
        setRevision(revision + 1);
    }, [determination]);

    const title = determination
        ? `${determination.well} (${determination.sample_id})`
        : "None Selected";
    // title feature not currently working... determination appears to always be undefined
    return (
        <GraphContextProvider>
            <Row gutter={15}>
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
                                title="Not Detected"
                                value={statistics.notDetected}
                            />
                            <Statistic
                                title="Detected"
                                value={statistics.detected}
                                style={{ margin: "0 20px" }}
                            />
                            <Statistic
                                title="Repeat"
                                value={statistics.repeat}
                            />
                            <Statistic
                                title="Inconclusive"
                                value={statistics.inconclusive}
                                style={{ margin: "0 20px" }}
                            />
                            <Statistic
                                title="Invalid"
                                value={statistics.invalid}
                            />
                            <Statistic
                                title="Controls"
                                value={statistics.control}
                                style={{ margin: "0 20px" }}
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
                            title={title}
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
                                value={stats.max(nGeneData)}
                            />
                            <Statistic
                                title="S Gene"
                                value={stats.max(sGeneData)}
                                style={{ margin: "0 20px" }}
                            />
                            <Statistic
                                title="ORF1ab"
                                value={stats.max(orf1abData)}
                            />
                            <Statistic
                                title="MS2"
                                value={stats.max(ms2Data)}
                                style={{ margin: "0 20px" }}
                            />
                            <Statistic
                                title="RP-Cy5"
                                value={stats.max(rpcy5Data)}
                            />
                        </Row>
                    </Card>
                </Col>
            </Row>
        </GraphContextProvider>
    );
};
