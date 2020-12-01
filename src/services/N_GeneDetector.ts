import * as tf from '@tensorflow/tfjs'
import { ExportSample } from '../types'
import NGeneAmplification from '../ai/NGeneAmplification'

const normalize = (rns: number[]) => rns.filter((r, i) => i > 9)

const getRank = (
    prediction: tf.Tensor<tf.Rank> | tf.Tensor<tf.Rank>[]
): tf.Tensor<tf.Rank> | undefined =>
    !Array.isArray(prediction) ? prediction : undefined

export default async ({
    rns: { n_gene_delta },
}: ExportSample): Promise<[boolean, number]> => {
    const model = await NGeneAmplification.getModel() as tf.LayersModel
    const normalized = [normalize(n_gene_delta)]
    const prediction = getRank(
        model.predict(tf.tensor(normalized).expandDims(0))
    )

    if (prediction) {
        const array = await prediction.array()

        if (Array.isArray(array)) {
            const ai_value = array.flat(6)[0]
            const confidence = Math.abs(ai_value - 0.5) * 2

            if (confidence < 0.99) {
                return [true, confidence]
            }

            return [ai_value < 0.5 ? false : true, confidence]
        }
    }

    return [true, 0]
}
