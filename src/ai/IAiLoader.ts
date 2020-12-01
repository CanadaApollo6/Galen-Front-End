import tf from '@tensorflow/tfjs'

export interface AiLoader {
    getModel: () => Promise<tf.LayersModel | undefined>
}
