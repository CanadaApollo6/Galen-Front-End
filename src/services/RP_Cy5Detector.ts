import * as tf from '@tensorflow/tfjs'
import { ExportSample } from '../types'
import RpCy5Amplification from '../ai/RpCy5Amplification'

const normalize = (rns: number[]) => rns.filter((r, i) => i > 9)

const getRank = (
    prediction: tf.Tensor<tf.Rank> | tf.Tensor<tf.Rank>[]
): tf.Tensor<tf.Rank> | undefined =>
    !Array.isArray(prediction) ? prediction : undefined

export default async ({
    rns: { rp_cy5_delta },
}: ExportSample): Promise<[boolean, number]> => {
    const model = await RpCy5Amplification.getModel() as tf.LayersModel
    const normalized = [normalize(rp_cy5_delta)]
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
