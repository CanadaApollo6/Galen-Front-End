import { Sample } from "../types"
import CovidDetector from "./CovidDetector"
import QuantExportParser from "./QuantExportParser"
import N_GeneDetector from "./N_GeneDetector"
import S_GeneDetector from "./S_GeneDetector"
import ORF1abDetector from "./ORF1abDetector"
import RP_Cy5Detector from "./RP_Cy5Detector"

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
        amplifications: []
    }))
}

const applyN_GeneDetector = async (samples: Sample[]): Promise<Sample[]> => {
    const sample_prediction_promises = samples.map(async (s) => {
        if (s.prediction === 'Repeat') return s

        const [prediction, confidence] = await N_GeneDetector(s)

        return { ...s, prediction, confidence, amplifications: prediction ? [...s.amplifications, "N Gene"] : s.amplifications }
    })

    const sample_predictions = await Promise.all(sample_prediction_promises)

    return sample_predictions.map((x) => ({
        ...x,
    })) as Sample[]
}


const applyS_GeneDetector = async (samples: Sample[]): Promise<Sample[]> => {
    const sample_prediction_promises = samples.map(async (s) => {
        if (s.prediction === 'Repeat') return s

        const [prediction, confidence] = await S_GeneDetector(s)

        return { ...s, prediction, confidence, amplifications: prediction ? [...s.amplifications, "S Gene"] : s.amplifications }
    })

    const sample_predictions = await Promise.all(sample_prediction_promises)

    return sample_predictions.map((x) => ({
        ...x,
    })) as Sample[]
}

const applyORF1abDetector = async (samples: Sample[]): Promise<Sample[]> => {
    const sample_prediction_promises = samples.map(async (s) => {
        if (s.prediction === 'Repeat') return s

        const [prediction, confidence] = await ORF1abDetector(s)

        return { ...s, prediction, confidence, amplifications: prediction ? [...s.amplifications, "ORF1ab"] : s.amplifications }
    })

    const sample_predictions = await Promise.all(sample_prediction_promises)

    return sample_predictions.map((x) => ({
        ...x,
    })) as Sample[]
}

const applyRP_Cy5Detector = async (samples: Sample[]): Promise<Sample[]> => {
    const sample_prediction_promises = samples.map(async (s) => {
        if (s.prediction === 'Repeat') return s

        const [prediction, confidence] = await RP_Cy5Detector(s)

        return { ...s, prediction, confidence, amplifications: prediction ? [...s.amplifications, "RP-Cy5"] : s.amplifications }
    })

    const sample_predictions = await Promise.all(sample_prediction_promises)

    return sample_predictions.map((x) => ({
        ...x,
    })) as Sample[]
}
// const applyRepeatAi = async (samples: Sample[]): Promise<Sample[]> => {
//     const invalid_promises = samples.map(async (s) => {
//         if (s.prediction === 'Repeat') return s

//         const [prediction, confidence] = await InvalidDetector(s)

//         return { ...s, prediction, confidence, determination: prediction }
//     })

//     return await Promise.all(invalid_promises)
// }

const applyMS2Threshold = (samples: Sample[]): Sample[] =>
    samples.map(s => s.rns.ms2_delta.slice(0, 37).some(r => r > 50000) ? { ...s, amplifications: [...s.amplifications, 'MS2'] } : s)

// const applyRPCy5Threshold = (samples: Sample[]): Sample[] =>
//      samples.map(s => s.rns.rp_cy5_delta.slice(0, 37).some(r => r > 50000) ? { ...s, amplifications: [...s.amplifications, 'RP-Cy5'] } : s)

const importQuantFile = async (file: File): Promise<Sample[]> => {
    const samples: Sample[] = (await QuantExportParser(file)).map(x => ({
        ...x,
        determination: undefined,
        prediction: undefined,
        confidence: 0,
        evaluated: false,
        amplifications: []
    }))

    const thresholded_samples: Sample[] = applyMS2Threshold(samples).map(s => {
        if (!s.amplifications.includes('MS2'))
            return { ...s, prediction: 'Repeat', determination: 'Repeat', confidence: 1 }

        return s
    })
    // const repeated_samples = await applyRepeatAi(thresholded_samples)
    const detected_samples = await applyCovidAi(thresholded_samples)
    const aggregatedSamples = async (thresholded_samples: Sample[]): Promise<Sample[]> => {

        const rp_cy5_results = await applyRP_Cy5Detector(thresholded_samples)
        const n_gene_results = await applyN_GeneDetector(rp_cy5_results)
        const s_gene_results = await applyS_GeneDetector(n_gene_results)
        const orf1ab_results = await applyORF1abDetector(s_gene_results)

        const final_results: Sample[] = orf1ab_results.map(s => {
            // Rp-Cy5 Check
            if (!s.amplifications.includes("RP-Cy5"))
                return {...s, prediction: "Repeat", determination: "Repeat"}
            
            // All 3 amplified
            else if (s.amplifications.includes("N Gene") && s.amplifications.includes("S Gene") && s.amplifications.includes("ORF1ab"))
                return {...s, prediction: "Detected", determination: "Detected"}
            
            // All 3 negative
            else if (!s.amplifications.includes("N Gene") && !s.amplifications.includes("S Gene") && !s.amplifications.includes("ORF1ab"))
                return {...s, prediction: "Not Detected", determination: "Not Detected"}

            // If 2 are amplified
            // S + ORF1ab
            else if (!s.amplifications.includes("N Gene") && s.amplifications.includes("S Gene") && s.amplifications.includes("ORF1ab"))
                return {...s, prediction: "Detected", determination: "Detected"}
            // N + ORF1ab
            else if (s.amplifications.includes("N Gene") && !s.amplifications.includes("S Gene") && s.amplifications.includes("ORF1ab"))
                return {...s, prediction: "Detected", determination: "Detected"}
            // N + S
            else if (s.amplifications.includes("N Gene") && s.amplifications.includes("S Gene") && !s.amplifications.includes("ORF1ab"))
                return {...s, prediction: "Detected", determination: "Detected"}
            
            // If only one is amplified
            // N Gene
            else if (!s.amplifications.includes("N Gene") || !s.amplifications.includes("S Gene") || !s.amplifications.includes("ORF1ab"))
                return {...s, prediction: "Inconclusive", determination: "Inconclusive"}
            return s
        })

        return final_results
    }

    
    const comparedDetectorResults = (detected_samples: Sample[], aggregatedSamples: Sample[]): Sample[] => {
        const comparedResults = aggregatedSamples
        for (const sample of detected_samples) {
            for (const comparedSample of comparedResults) {
                if (comparedSample.sample_id === sample.sample_id) {
                    if (comparedSample.prediction !== sample.prediction && comparedSample.determination !== sample.determination) {
                        comparedSample.determination = "Inconclusive"
                        comparedSample.prediction = "Inconclusive"
                    }
                }
            }
        }
        return comparedResults
    }
    const comparedResults = comparedDetectorResults(detected_samples, await aggregatedSamples(thresholded_samples))
    return comparedResults
}

export default importQuantFile
