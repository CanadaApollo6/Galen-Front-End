import * as tf from "@tensorflow/tfjs";
import { Determination } from "../types";
import { ExportSample } from "../types";

let model: tf.LayersModel;

tf.loadLayersModel("pnjs/model.json").then((m) => (model = m));

const normalize = (rns: number[]) => rns.map((r) => r / 100000);

const getRank = (
    prediction: tf.Tensor<tf.Rank> | tf.Tensor<tf.Rank>[]
): tf.Tensor<tf.Rank> | undefined =>
    !Array.isArray(prediction) ? prediction : undefined;

export default async ({
    rns: { n_gene_delta, orf1ab_delta, s_gene_delta },
}: ExportSample): Promise<[Determination, number]> => {
    const normalized = [
        normalize(n_gene_delta),
        normalize(orf1ab_delta),
        normalize(s_gene_delta),
    ];
    const prediction = getRank(
        model.predict(tf.tensor(normalized).expandDims(0))
    );

    if (prediction) {
        const array = await prediction.array();

        if (Array.isArray(array)) {
            const ai_value = array.flat(6)[0];
            const confidence = Math.abs(ai_value - 0.5) * 2;

            if (confidence < 0.99) {
                return ["Inconclusive", confidence];
            }

            return [ai_value < 0.5 ? "Detected" : "Not Detected", confidence];
        }
    }

    return ["Inconclusive", 0];
};
