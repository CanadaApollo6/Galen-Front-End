export type Determination = 'Detected' | 'Not Detected' | 'Inconclusive' | 'Invalid' | 'Repeat'

export type RnDeltaType = 'rp_cy5_delta' | 'n_gene_delta' | 's_gene_delta' | 'orf1ab_delta' | 'ms2_delta'

export type RnType = 'rp_cy5' | 'n_gene' | 's_gene' | 'orf1ab' | 'ms2' | RnDeltaType

export type Rns = Record<RnType, number[]>

export type SampleDetermination = {
    sample_id: string,
    well: string,
    elution: number,
    determination: Determination | undefined,
    prediction: Determination | undefined
    confidence: number,
    evaluated: boolean | undefined,
    amplifications: Amplification[]
}

export type Amplification = 'N Gene' | 'S Gene' | 'ORF1ab' | 'MS2' | 'RP-Cy5'

export type SampleRns = Record<string, Rns>

export type ExportSample = {
    sample_id: string,
    well: string
    elution: number
    rns: Rns
}

export type GraphType = 'linear' | 'logarithmic'

export type Sample = {
    sample_id: string,
    well: string
    elution: number
    determination: Determination | undefined,
    prediction: Determination | undefined
    confidence: number,
    evaluated: boolean | undefined,
    amplifications: Amplification[],
    rns: Rns
}
