import * as tf from '@tensorflow/tfjs'
import { AiLoader } from './IAiLoader'

let model: tf.LayersModel | undefined

const NGeneAmplification: AiLoader = {
    getModel: async () => {
        if (!model) {
            try {
                model = await tf.loadLayersModel('pnjs/model.json')
            } catch (e) {
                // eslint-disable-next-line no-console
                console.log('Aggregate Detected AI Failed to load', e)
                return undefined
            }
        }

        return model
    }
}

export default NGeneAmplification
