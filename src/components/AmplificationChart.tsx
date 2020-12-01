import React, { useContext, useEffect, useMemo, useRef } from 'react'
import { GraphContext } from '../contexts/GraphContext'
import { SampleDetermination } from '../types'
import { SampleChartProps } from './AmpChart'
import * as d3 from 'd3'

export type AmpChartProps = { determinations: SampleDetermination[] }

export const AmpChart: React.FC<AmpChartProps> = ({ determinations }) => {
    const wells = useMemo(() => determinations.map((d) => d.well), [
        determinations,
    ])
    const { scale, target, graphType } = useContext(GraphContext)

    return (
        <SampleChart
            scale={scale}
            target={target}
            graphType={graphType}
            wells={wells}
        />
    )
}

const SampleChart: React.FC<SampleChartProps> = () => {
    const context = useRef<HTMLDivElement>(document.createElement('div'))

    useEffect(() => {
        const data = [12, 5, 6, 6, 9, 10]
        const svg = d3.select(`#${context.current.id}`).append('svg') //.attr("width", '100%').attr("height", 300);
        svg.data(data).enter()
        svg.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', (d, i) => i * 70)
            .attr('y', 0)
            .attr('width', 25)
            .attr('height', (d, i) => d)
            .attr('fill', 'green')
    }, [context])

    return <div id="test" ref={context} style={{ width: '100%' }}></div>
}

export default AmpChart
