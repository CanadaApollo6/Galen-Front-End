import React from "react";
import { SampleDetermination } from "../types";

const getSquareColor = (
    d: SampleDetermination,
    selectedWells: SampleDetermination[] | undefined
): string => {
    if (selectedWells?.some((w) => w.well === d.well)) return "white";
    if (["neg", "PC"].includes(d.sample_id)) return "grey";
    if (d.determination === "Detected") return "crimson";
    if (d.determination === "Repeat") return "yellow";
    if (d.determination === "Inconclusive") return "orange";
    if (d.determination === "Invalid") return "mediumpurple";
    if (d.determination === "Not Detected") return "skyblue";

    return "";
};

const getTextStyle = (sample: SampleDetermination) => {
    if (sample.prediction !== sample.determination) {
        return "underline";
    } else {
        return "none";
    }
};

const getFontStyle = (sample: SampleDetermination) => {
    if (sample.prediction !== sample.determination) {
        return "italic";
    } else {
        return "normal";
    }
};

type SampleSquareProps = {
    sample: SampleDetermination;
    onSelect?: (sample: SampleDetermination) => void;
    selectedWells?: SampleDetermination[];
};

const setToViewed = (sample: SampleDetermination) => {
    if (sample.evaluated === false) {
        sample.evaluated = true;
    }
};

const SampleSquare: React.FC<SampleSquareProps> = ({
    sample,
    onSelect,
    selectedWells,
}) => (
    <div style={{ display: "table-cell" }}>
        <div
            onClick={
                onSelect
                    ? () => {
                          onSelect(sample);
                          setToViewed(sample);
                      }
                    : () => undefined
            }
            style={{
                paddingTop: "100%",
                background: getSquareColor(sample, selectedWells),
                border: "2px solid #d0d0d0",
                position: "relative",
                margin: -1,
            }}
        >
            <span
                style={{
                    position: "absolute",
                    top: 7,
                    bottom: 0,
                    left: 6,
                    right: 0,
                    fontWeight: sample.evaluated ? "normal" : "bold",
                    textDecoration: getTextStyle(sample),
                    fontStyle: getFontStyle(sample),
                }}
            >
                {sample.well}
            </span>
        </div>
    </div>
);

type RowProps = {
    samples: SampleDetermination[];
    onSelect?: (sample: SampleDetermination) => void;
    selectedWells?: SampleDetermination[];
};

const Row: React.FC<RowProps> = ({ samples, onSelect, selectedWells }) => (
    <div style={{ display: "table", width: "100%" }}>
        {samples.map((s) => (
            <SampleSquare
                sample={s}
                onSelect={onSelect}
                selectedWells={selectedWells}
            />
        ))}
    </div>
);

type PlateProps = {
    samples: SampleDetermination[];
    rowCount: number;
    onSelect?: (sample: SampleDetermination) => void;
    selectedWells?: SampleDetermination[];
};
type SampleRowAccumaltor = [SampleDetermination[][], SampleDetermination[]];

const PlateMap: React.FC<PlateProps> = ({
    samples,
    rowCount,
    onSelect,
    selectedWells,
}) => {
    const reducer = (
        acc: SampleRowAccumaltor,
        s: SampleDetermination,
        i: number
    ): SampleRowAccumaltor =>
        i % rowCount === rowCount - 1
            ? [acc[0].concat([[...acc[1], s]]), []]
            : [acc[0], [...acc[1], s]];

    const rows: SampleDetermination[][] = samples.reduce(reducer, [[], []])[0];

    return (
        <div style={{ width: "100%" }}>
            {rows.map((s) => (
                <Row
                    samples={s}
                    onSelect={onSelect}
                    selectedWells={selectedWells}
                />
            ))}
        </div>
    );
};

export default PlateMap;
