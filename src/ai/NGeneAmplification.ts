import * as tf from '@tensorflow/tfjs'
import { AiLoader } from './IAiLoader'

let model: tf.LayersModel | undefined

const NGeneAmplification: AiLoader = {
    getModel: async () => {
        if (!model) {
            try {
                model = await tf.loadLayersModel('n_gene/model.json')
            } catch (e) {
                // eslint-disable-next-line no-console
                console.log('N Gene Amplification AI Failed to load', e)
                return undefined
            }
        }

        return model
    }
}

export default NGeneAmplification
