import { Sample } from '../types'
import CovidDetector from './CovidDetector'
import QuantExportParser from './QuantExportParser'
import N_GeneDetector from './N_GeneDetector'
import S_GeneDetector from './S_GeneDetector'
import ORF1abDetector from './ORF1abDetector'
import RP_Cy5Detector from './RP_Cy5Detector'

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
        amplifications: [],
    }))
}

const applyN_GeneDetector = async (samples: Sample[]): Promise<Sample[]> => {
    const sample_prediction_promises = samples.map(async (s) => {
        if (s.prediction === 'Repeat') return s

        const [prediction, confidence] = await N_GeneDetector(s)

        return {
            ...s,
            prediction,
            confidence,
            amplifications: prediction
                ? [...s.amplifications, 'N Gene']
                : s.amplifications,
        }
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

        return {
            ...s,
            prediction,
            confidence,
            amplifications: prediction
                ? [...s.amplifications, 'S Gene']
                : s.amplifications,
        }
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

        return {
            ...s,
            prediction,
            confidence,
            amplifications: prediction
                ? [...s.amplifications, 'ORF1ab']
                : s.amplifications,
        }
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

        return {
            ...s,
            prediction,
            confidence,
            amplifications: prediction
                ? [...s.amplifications, 'RP-Cy5']
                : s.amplifications,
        }
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

// const applyMS2Threshold = (samples: Sample[]): Sample[] =>
//     samples.map((s) =>
//         s.rns.ms2_delta.slice(0, 37).some((r) => r > 50000)
//             ? { ...s, amplifications: [...s.amplifications, "MS2"] }
//             : s
//     );

// const applyRPCy5Threshold = (samples: Sample[]): Sample[] =>
//      samples.map(s => s.rns.rp_cy5_delta.slice(0, 37).some(r => r > 50000) ? { ...s, amplifications: [...s.amplifications, 'RP-Cy5'] } : s)

const importQuantFile = async (file: File): Promise<Sample[]> => {
    const samples: Sample[] = (await QuantExportParser(file)).map((x) => ({
        ...x,
        determination: undefined,
        prediction: undefined,
        confidence: 0,
        evaluated: false,
        amplifications: [],
    }))

    //   const thresholded_samples: Sample[] = applyMS2Threshold(samples).map((s) => {
    //     if (!s.amplifications.includes("MS2"))
    //       return {
    //         ...s,
    //         prediction: "Repeat",
    //         determination: "Repeat",
    //         confidence: 1,
    //       };

    //     return s;
    //   });
    // const repeated_samples = await applyRepeatAi(thresholded_samples)
    const detected_samples = await applyCovidAi(samples)
    const aggregatedSamples = async (thresholded_samples: Sample[]): Promise<Sample[]> => {
        const rp_cy5_results = await applyRP_Cy5Detector(samples)
        const n_gene_results = await applyN_GeneDetector(rp_cy5_results)
        const orf1ab_results = await applyORF1abDetector(n_gene_results)
        const s_gene_results = await applyS_GeneDetector(orf1ab_results)

        for (const n of n_gene_results) {
            for (const o of orf1ab_results) {
                for (const s of s_gene_results) {
                    if (
                        n.sample_id === o.sample_id &&
                        o.sample_id === s.sample_id
                    ) {
                        s.confidence =
                            (o.confidence + s.confidence + n.confidence) / 3
                    }
                }
            }
        }

        const final_results: Sample[] = s_gene_results.map((s) => {
            // Rp-Cy5 Check
            if (!s.amplifications.includes('RP-Cy5'))
                return {
                    ...s,
                    prediction: 'Repeat',
                    determination: 'Repeat',
                    confidence: 1,
                }
            // All 3 amplified
            else if (
                s.amplifications.includes('N Gene') &&
                s.amplifications.includes('S Gene') &&
                s.amplifications.includes('ORF1ab')
            )
                return {
                    ...s,
                    prediction: 'Detected',
                    determination: 'Detected',
                }
            // All 3 negative
            else if (
                !s.amplifications.includes('N Gene') &&
                !s.amplifications.includes('S Gene') &&
                !s.amplifications.includes('ORF1ab')
            )
                return {
                    ...s,
                    prediction: 'Not Detected',
                    determination: 'Not Detected',
                }
            // If 2 are amplified
            // S + ORF1ab
            else if (
                !s.amplifications.includes('N Gene') &&
                s.amplifications.includes('S Gene') &&
                s.amplifications.includes('ORF1ab')
            )
                return {
                    ...s,
                    prediction: 'Detected',
                    determination: 'Detected',
                }
            // N + ORF1ab
            else if (
                s.amplifications.includes('N Gene') &&
                !s.amplifications.includes('S Gene') &&
                s.amplifications.includes('ORF1ab')
            )
                return {
                    ...s,
                    prediction: 'Detected',
                    determination: 'Detected',
                }
            // N + S
            else if (
                s.amplifications.includes('N Gene') &&
                s.amplifications.includes('S Gene') &&
                !s.amplifications.includes('ORF1ab')
            )
                return {
                    ...s,
                    prediction: 'Detected',
                    determination: 'Detected',
                }
            // If only one is amplified
            else if (
                !s.amplifications.includes('N Gene') ||
                !s.amplifications.includes('S Gene') ||
                !s.amplifications.includes('ORF1ab')
            )
                return {
                    ...s,
                    prediction: 'Inconclusive',
                    determination: 'Inconclusive',
                }
            return s
        })

        return final_results
    }

    const comparedDetectorResults = (
        detected_samples: Sample[],
        aggregatedSamples: Sample[]
    ): Sample[] => {
        const comparedResults = aggregatedSamples
        for (const sample of detected_samples) {
            for (const comparedSample of comparedResults) {
                if (comparedSample.sample_id === sample.sample_id) {
                    comparedSample.confidence =
                        (sample.confidence + comparedSample.confidence) / 2
                    comparedSample.confidence =
                        Math.trunc(comparedSample.confidence * 10000) / 10000
                    if (
                        comparedSample.prediction !== sample.prediction &&
                        comparedSample.determination !== sample.determination &&
                        comparedSample.sample_id !== 'neg' &&
                        comparedSample.sample_id !== 'PC'
                    ) {
                        comparedSample.determination = 'Inconclusive'
                        comparedSample.prediction = 'Inconclusive'
                    }
                }
                if (
                    comparedSample.prediction === 'Inconclusive' ||
                    comparedSample.prediction === 'Repeat' ||
                    comparedSample.prediction === 'Detected'
                ) {
                    comparedSample.evaluated = false
                } else if (comparedSample.confidence >= 0.995) {
                    comparedSample.evaluated = true
                }
            }
        }

        return comparedResults
    }
    const comparedResults = comparedDetectorResults(
        detected_samples,
        await aggregatedSamples(samples)
    )

    // Control check alert system
    const sample_ids = []
    const alerts: string[] = []
    for (const c of comparedResults) {
        sample_ids.push(c.sample_id)

        // Are negative controls in the correct wells?
        if (
            c.sample_id === 'neg' &&
            c.well !== 'O21' &&
            c.well !== 'O22' &&
            c.well !== 'O23' &&
            c.well !== 'O24' &&
            c.well !== 'P21' &&
            c.well !== 'P22' &&
            c.well !== 'P23'
        ) {
            alerts.push(
                'NOTE: There appears to be a negative control in well ' +
                    c.well +
                    '.' +
                    '\n'
            )
        }

        // Is the positive control in well P24?
        if (c.sample_id === 'pc' && c.well !== 'P24') {
            alerts.push(
                'NOTE: The positive control is in well ' +
                    c.well +
                    ' and not well P24.' +
                    '\n'
            )
        }

        // Is the positive control actually positive?
        if (c.sample_id === 'pc' && c.prediction !== 'Detected') {
            alerts.push(
                'NOTE: The positive control in well ' +
                    c.well +
                    ' returned a ' +
                    c.prediction +
                    ' result.' +
                    '\n'
            )
        }

        // Are the negative controls actually negative?
        if (c.sample_id === 'neg' && c.prediction !== 'Repeat') {
            alerts.push(
                'NOTE: A negative control in well ' +
                    c.well +
                    ' returned a ' +
                    c.prediction +
                    ' result.' +
                    '\n'
            )
        }
    }

    // Does a labelled positive control exist?
    if (!sample_ids.includes('pc')) {
        alerts.push(
            'NOTE: This plate does not appear to contain a positive control.' +
                '\n'
        )
    }

    // Do labelled negative controls exist?
    if (!sample_ids.includes('neg')) {
        alerts.push(
            'NOTE: This plate does not appear to contain any negative controls.' +
                '\n'
        )
    }

    const sample_negs: string[] = []
    const sample_pcs: string[] = []
    for (const s of sample_ids) {
        if (s === 'neg') {
            sample_negs.push(s)
        }
        if (s === 'pc') {
            sample_pcs.push(s)
        }
    }
    // Are there exactly 7 negative controls?
    if (sample_negs.length !== 7) {
        alerts.push(
            'NOTE: There appear to be ' +
                sample_negs.length +
                ' negative controls when there should be 7.' +
                '\n'
        )
    }

    // Is there more than 1 positive control?
    if (sample_pcs.length > 1) {
        alerts.push(
            'NOTE: There appear to be ' +
                sample_pcs.length +
                ' positive controls when there should only be 1.' +
                '\n'
        )
    }

    // Are there 8 controls in total?
    if (sample_pcs.length + sample_negs.length !== 8) {
        alerts.push(
            'NOTE: There are ' +
                (sample_pcs.length + sample_negs.length) +
                ' control samples in this plate instead of 8.' +
                '\n'
        )
    }

    // Are there any messages to alert the lab tech about?
    if (alerts.length > 0) {
        alert(alerts.toString().replaceAll(',', ''))
    }
    if (alerts.length === 0) {
        alert('All initial control checks passed!')
    }
    return comparedResults
}

export default importQuantFile
