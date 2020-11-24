import { SampleDetermination, Determination } from "../types";

const determinationToCovidResult = (result: Determination | undefined) => {
    switch (result) {
        case "Detected":
            return "DETECTED";
        case "Not Detected":
            return "NON-DETECTED";
        case "Invalid":
            return "INVALID";
        case "Inconclusive":
            return "INCONCLUSIVE";
        default:
            return "";
    }
};

const determinationToSARS2TPResult = (result: Determination | undefined) => {
    switch (result) {
        case "Detected":
            return "DETECTED";
        case "Not Detected":
            return "NOT DETECTED";
        case "Invalid":
            return "INVALID";
        case "Inconclusive":
            return "INCONCLUSIVE";
        default:
            return "";
    }
};

const determinationToCovid = ({
    determination,
    sample_id,
}: SampleDetermination) =>
    `"${sample_id}",COVID-19,${determinationToCovidResult(determination)}`;

const determinationToCovcol = ({ sample_id }: SampleDetermination) =>
    `"${sample_id}",COVCOL,"Collected by Gravity Diagnostics"`;

const determinationToSARS2TP = ({
    determination,
    sample_id,
}: SampleDetermination) =>
    `"${sample_id}",SARS2TP,"${determinationToSARS2TPResult(determination)}"`;

export const parseCsvContent = (
    determinations: SampleDetermination[]
): string => {
    const header = ['"Sample ID",TEST,RESULT'];
    const covid = determinations.map(determinationToCovid);
    const covcol = determinations.map(determinationToCovcol);
    const sars2tp = determinations.map(determinationToSARS2TP);

    return header
        .concat(covid, covcol, sars2tp)
        .reduce((csv, row) => csv + row + "\n", "");
};
