import * as tf from '@tensorflow/tfjs'
import { ExportSample, Determination } from '../types';

let model: tf.LayersModel

tf.loadLayersModel('vijs/model.json').then(m => model = m)

const normalize = (rns: number[]) => rns.map(r => r / 100000)

const getRank = (prediction: tf.Tensor<tf.Rank> | tf.Tensor<tf.Rank>[]): tf.Tensor<tf.Rank> | undefined =>
    !Array.isArray(prediction) ? prediction : undefined

export default async ({ rns: {rp_cy5_delta, n_gene_delta, s_gene_delta, orf1ab_delta, ms2_delta} }: ExportSample): Promise<[Determination, number]> => {
    const normalized = [rp_cy5_delta, n_gene_delta, s_gene_delta, orf1ab_delta, ms2_delta].map(r => normalize(r))
    const prediction = getRank(model.predict(tf.tensor(normalized).expandDims(0)))

    if (prediction) {
        const array = await prediction.array()

        if (Array.isArray(array)) {
            const ai_value = array.flat(6)[0]
            const confidence = Math.abs(ai_value - .5) * 2

            if (confidence < .99) {
                return ['Inconclusive', confidence]
            }

            return [ai_value < .5 ? 'Not Detected' : 'Repeat', confidence]
        }
    }

    return ['Inconclusive', 0]
}
