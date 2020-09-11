import { Sample } from "../types"
import CovidDetector from "./CovidDetector"
import InvalidDetector from "./InvalidDetector"
import QuantExportParser from "./QuantExportParser"

const applyCovidAi = async (samples: Sample[]): Promise<Sample[]> => {
    const sample_prediction_promises = samples.map(async (s) => {
        if (s.prediction === 'Repeat') return s

        const [prediction, confidence] = await CovidDetector(s)

        return { ...s, prediction, confidence, determination: prediction }
    })

    const sample_predictions = await Promise.all(sample_prediction_promises)

    return sample_predictions.map((x) => ({
        ...x,
        determination: x.prediction,
        evaluated: false,
        amplifications: x.prediction === 'Detected' ? [...x.amplifications, 'S Gene', 'N Gene', 'ORF1ab'] : []
    }))
}

const applyRepeatAi = async (samples: Sample[]): Promise<Sample[]> => {
    const invalid_promises = samples.map(async (s) => {
        if (s.prediction === 'Repeat') return s

        const [prediction, confidence] = await InvalidDetector(s)

        return { ...s, prediction, confidence, determination: prediction }
    })

    return await Promise.all(invalid_promises)
}

const applyMS2Threshold = (samples: Sample[]): Sample[] =>
    samples.map(s => s.rns.ms2_delta.slice(0, 37).some(r => r > 50000) ? { ...s, amplifications: [...s.amplifications, 'MS2'] } : s)

const applyRPCy5Threshold = (samples: Sample[]): Sample[] =>
    samples.map(s => s.rns.rp_cy5_delta.slice(0, 37).some(r => r > 50000) ? { ...s, amplifications: [...s.amplifications, 'RP-Cy5'] } : s)

const importQuantFile = async (file: File): Promise<Sample[]> => {
    const samples: Sample[] = (await QuantExportParser(file)).map(x => ({
        ...x,
        determination: undefined,
        prediction: undefined,
        confidence: 0,
        evaluated: false,
        amplifications: []
    }))

    const thresholded_samples: Sample[] = applyMS2Threshold(applyRPCy5Threshold(samples)).map(s => {
        if (!s.amplifications.includes('MS2') || !s.amplifications.includes('RP-Cy5'))
            return { ...s, prediction: 'Repeat', determination: 'Repeat', confidence: 1 }

        return s
    })
    console.log(thresholded_samples)
    const repeated_samples = await applyRepeatAi(thresholded_samples)
    const detected_samples = await applyCovidAi(repeated_samples)

    return detected_samples
}

export default importQuantFile
