import * as tf from '@tensorflow/tfjs'
import { AiLoader } from './IAiLoader'

let model: tf.LayersModel | undefined

const Orf1abAmplification: AiLoader = {
    getModel: async () => {
        if (!model) {
            try {
                model = await tf.loadLayersModel('orf1ab/model.json')
            } catch (e) {
                // eslint-disable-next-line no-console
                console.log('N Gene Amplification AI Failed to load', e)
                return undefined
            }
        }

        return model
    }
}

export default Orf1abAmplification
