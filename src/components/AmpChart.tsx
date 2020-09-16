import React, { useEffect, useContext, useState, useRef } from 'react'
import { Chart as Chartjs } from 'chart.js'
import { PlateContext } from '../contexts/PlateContext'
import { SampleDetermination, RnDeltaType, SampleRns } from '../types'
import { GraphContext } from '../contexts/GraphContext'

const getDataSets = (rns: SampleRns, wells: string[], target: RnDeltaType | '' | undefined): Chart.ChartDataSets[] => {
    const config: Record<RnDeltaType, { color: string, label: string }> = {
        rp_cy5_delta: { color: 'brown', label: 'RP-Cy5' },
        n_gene_delta: { color: 'blue', label: 'N Gene' },
        s_gene_delta: { color: 'green', label: 'S Gene' },
        orf1ab_delta: { color: 'red', label: 'ORF1ab' },
        ms2_delta: { color: 'orange', label: 'MS2' },
    }

    const mapTargetToDataSet = (target: RnDeltaType, well: string) =>
        ({ label: config[target]['label'], data: rns[well][target], borderColor: config[target]['color'], fill: false })

    return wells.map(well => target
        ? mapTargetToDataSet(target, well)
        : Object.keys(config).map(k => (mapTargetToDataSet(k as RnDeltaType, well)))
    ).flat()
}

export type SampleChartProps = { scale: number | undefined, target: RnDeltaType | undefined | '', wells: string[], graphType: 'linear' | 'logarithmic' }

export const SampleChart: React.FC<SampleChartProps> = ({ scale, target, graphType, wells }) => {
    const { rns } = useContext(PlateContext)
    const context = useRef<HTMLCanvasElement>(document.createElement('canvas'))

    useEffect(() => {
        const datasets = getDataSets(rns, wells, target)

        new Chartjs(context.current, {
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
                    display: false
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
    }, [rns, wells, target, graphType, scale])

    return (
        <div style={{ width: '100%' }}>
            <canvas ref={context} />
        </div>
    )
}

export type AmpChartProps = { determinations: SampleDetermination[] }

export const AmpChart: React.FC<AmpChartProps> = ({ determinations }) => {
    const [wells, setWells] = useState<string[]>([])
    const { scale, target, graphType } = useContext(GraphContext)

    useEffect(() => {
        setWells(determinations.map(d => d.well))
    }, [determinations, setWells])

    return <SampleChart scale={scale} target={target} graphType={graphType} wells={wells} />
}
