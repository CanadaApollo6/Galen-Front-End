import { ExportSample } from "../types"

const getText = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.addEventListener('load', e => {
        if (typeof e.target?.result === 'string') {
            return resolve(e.target.result)
        }

        reject(new Error('File could not be read'))
    })

    reader.addEventListener('error', e => reject(e))

    reader.readAsText(file, 'UTF-8')
})

type ResultRecord = { well: number, well_position: string, sample_id: string, target: string }

type AmplificationRecord = {
    well: number,
    cycle: number,
    target: string,
    rn: number,
    delta: number
}

type QuantMapper<T> = (data: string[]) => T

const resultMapper: QuantMapper<ResultRecord> = (data) => ({ well: parseInt(data[0]), well_position: data[1], sample_id: data[2], target: data[3] })

const amplificationMapper: QuantMapper<AmplificationRecord> = (data) => ({
    well: parseInt(data[0]),
    cycle: parseInt(data[1]),
    target: data[2],
    rn: parseFloat(data[3].replace(/,/g, '')),
    delta: parseFloat(data[4].replace(/,/g, ''))
})

const pullDataSet = <T>(mapper: QuantMapper<T>, lines: string[], index: number): [T[], number] => {
    const result = []

    for (let i = index; i < lines.length; i++) {
        if (lines[i] === '') return [result, i + 1]

        result.push(mapper(lines[i].split('\t')))
    }

    return [result, lines.length]
}

type QuantExport = { amplification: AmplificationRecord[], results: ResultRecord[] }

const parseQuantExport = async (file: File): Promise<QuantExport> => {
    const text = await getText(file)
    const lines = text.split(/\r?\n/)

    const quant_export: QuantExport = { amplification: [], results: [] }

    for (let i = 0; i < lines.length; i++) {
        if (lines[i] === '[Amplification Data]') {
            const [amplification, new_index] = pullDataSet(amplificationMapper, lines, i + 2)
            i = new_index
            quant_export.amplification = amplification
            continue
        }

        if (lines[i] === '[Results]') {
            const [results, new_index] = pullDataSet(resultMapper, lines, i + 2)
            quant_export.results = results
            i = new_index
        }
    }

    return quant_export
}

export default async (file: File): Promise<ExportSample[]> => {
    const quant_export = await parseQuantExport(file)

    const samples_rns: { [well: number]: any } = {}

    for (let amplification of quant_export.amplification) {
        const target = amplification.target.replace(' ', '_').replace('-', '_').toLowerCase()
        const delta = `${target}_delta`

        if (!samples_rns[amplification.well]) {
            samples_rns[amplification.well] = {
                rp_cy5: [],
                n_gene: [],
                s_gene: [],
                orf1ab: [],
                ms2: [],
                rp_cy5_delta: [],
                n_gene_delta: [],
                s_gene_delta: [],
                orf1ab_delta: [],
                ms2_delta: []
            }
        }

        samples_rns[amplification.well][target].push(amplification.rn)
        samples_rns[amplification.well][delta].push(amplification.delta)
    }

    return quant_export.results.filter(q => q.target === 'MS2').map((q): ExportSample => ({
        id: q.sample_id,
        well: q.well_position,
        rns: samples_rns[q.well]
    }))
}
