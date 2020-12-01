import * as tf from '@tensorflow/tfjs'
import { AiLoader } from './IAiLoader'

let model: tf.LayersModel | undefined

const RpCy5Amplification: AiLoader = {
    getModel: async () => {
        if (!model) {
            try {
                model = await tf.loadLayersModel('rp_cy5/model.json')
            } catch (e) {
                // eslint-disable-next-line no-console
                console.log('RP-Cy5 Amplification AI Failed to load', e)
                return undefined
            }
        }

        return model
    }
}

export default RpCy5Amplification
