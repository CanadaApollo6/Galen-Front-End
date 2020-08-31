import React, { useEffect, useContext } from 'react'
import { Chart as Chartjs } from 'chart.js'
import { PlateContext } from '../contexts/PlateContext'
import { isArray } from 'util'
import { Sample, RnType, RnDeltaType } from '../types'

const getDataSets = (samples: Sample[], target: RnDeltaType | undefined): Chart.ChartDataSets[] => {
    const config: Record<RnDeltaType, { color: string, label: string }> = {
        rp_cy5_delta: { color: 'brown', label: 'RP-Cy5' },
        n_gene_delta: { color: 'blue', label: 'N Gene' },
        s_gene_delta: { color: 'green', label: 'S Gene' },
        orf1ab_delta: { color: 'red', label: 'ORF1ab' },
        ms2_delta: { color: 'orange', label: 'MS2' },
    }

    const mapTargetToDataSet = (target: RnDeltaType, sample: Sample) =>
        ({ label: config[target]['label'], data: sample.rns[target], borderColor: config[target]['color'], fill: false })

    return samples.map(s => target
        ? mapTargetToDataSet(target, s)
        : Object.keys(config).map(k => (mapTargetToDataSet(k as RnDeltaType, s)))
    ).flat()
}

type SampleChartProps = { scale: number | undefined, target: RnDeltaType | undefined, samples: Sample[], graphType: 'linear' | 'logarithmic' }

export const SampleChart: React.FC<SampleChartProps> = ({ scale, target, samples, graphType }) => {
    const datasets = getDataSets(samples, target)

    useEffect(() => {
        const ctx = document.querySelector<HTMLCanvasElement>("#otherChart")

        if (!ctx) return

        new Chartjs(ctx, {
            type: 'line',
            data: {
                labels: new Array(40).fill(0).map((x, i) => i),
                datasets: [
                    { label: '50k Guide', data: new Array(40).fill(50000), borderColor: 'black', borderWidth: 5, borderDash: [10, 5], fill: false, hideInLegendAndTooltip: true },
                    ...datasets
                ]
            },
            options: {
                legend: {
                    display: !target
                },
                elements: {
                    point: {
                        radius: 0
                    }
                },
                scales: {
                    yAxes: [{
                        type: graphType,
                        ticks: {
                            beginAtZero: false,
                            max: scale
                        }
                    }]
                }
            }
        })
    })

    return (
        <div style={{ width: '100%' }}>
            <canvas id="otherChart" />
        </div>
    )
}

const Chart: React.FC<{ datasets: Chart.ChartDataSets[] }> = ({ datasets }) => {
    const { graphType, scale, target, activeSamples } = useContext(PlateContext)

    useEffect(() => {
        const ctx = document.getElementsByTagName("canvas")[0]

        if (!ctx) return

        new Chartjs(ctx, {
            type: 'line',
            data: {
                labels: new Array(40).fill(0).map((x, i) => i),
                datasets: [
                    { label: '50k Guide', data: new Array(40).fill(50000), borderColor: 'black', borderWidth: 5, borderDash: [10, 5], fill: false, hideInLegendAndTooltip: true },
                    ...datasets
                ]
            },
            options: {
                legend: {
                    display: !(target || isArray(activeSamples))
                },
                elements: {
                    point: {
                        radius: 0
                    }
                },
                scales: {
                    yAxes: [{
                        type: graphType,
                        ticks: {
                            beginAtZero: false,
                            max: scale
                        }
                    }]
                }
            }
        })
    })

    return (
        <div style={{ width: '100%' }}>
            <canvas id="myChart" />
        </div>
    )
}

const sampleToDataSets = ({ rns }: Sample, target: RnType | undefined): Chart.ChartDataSets[] => {
    if (!target) {
        const { ms2_delta, n_gene_delta, orf1ab_delta, rp_cy5_delta, s_gene_delta } = rns

        return [
            { label: 'MS2', data: ms2_delta, borderColor: 'orange', fill: false },
            { label: 'N Gene', data: n_gene_delta, borderColor: 'blue', fill: false },
            { label: 'ORF1ab', data: orf1ab_delta, borderColor: 'red', fill: false },
            { label: 'RP-Cy5', data: rp_cy5_delta, borderColor: 'brown', fill: false },
            { label: 'S Gene', data: s_gene_delta, borderColor: 'green', fill: false },
        ]
    }

    return [{ label: '', data: rns[target], borderColor: 'blue', fill: false }]
}

const DeltaRnVsCyclesChart: React.FC = () => {
    const { activeSamples, target } = useContext(PlateContext)

    if (!activeSamples) return null

    return isArray(activeSamples)
        ? <Chart datasets={activeSamples.map(s => sampleToDataSets(s, target)).flat()} />
        : <Chart datasets={sampleToDataSets(activeSamples, target)} />
}

export default DeltaRnVsCyclesChart
