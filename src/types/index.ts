export type Determination = 'Detected' | 'Not Detected' | 'Manual Review Required'

export type RnDeltaType = 'rp_cy5_delta' | 'n_gene_delta' | 's_gene_delta' | 'orf1ab_delta' | 'ms2_delta'

export type RnType = 'rp_cy5' | 'n_gene' | 's_gene' | 'orf1ab' | 'ms2' | RnDeltaType

export type Rns = Record<RnType, number[]>

export type Sample = {
    id: string,
    well: string
    rns: Rns,
    determination: Determination,
    confidence: number
}

export type ExportSample = {
    id: string,
    well: string
    rns: Rns
}
