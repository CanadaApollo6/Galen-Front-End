import * as tf from '@tensorflow/tfjs'
import { AiLoader } from './IAiLoader'

let model: tf.LayersModel | undefined

const SGeneAmplification: AiLoader = {
    getModel: async () => {
        if (!model) {
            try {
                model = await tf.loadLayersModel('s_gene/model.json')
            } catch (e) {
                // eslint-disable-next-line no-console
                console.log('S Gene Amplification AI Failed to load', e)
                return undefined
            }
        }

        return model
    }
}

export default SGeneAmplification
