// /* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef } from "react";
import * as d3 from 'd3';

interface LineGraphProps {
    data: { year: number; totalJobs: number }[];
}

const LineGraph: React.FC<LineGraphProps> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        const width = 500;
        const height = 300;
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };

        svg.selectAll('*').remove(); // Clear previous content to avoid overlapping.

        const x = d3.scaleLinear()
            .domain([2020, 2024])
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.totalJobs) || 0])
            .nice()
            .range([height - margin.bottom, margin.top]);

        // Declare the line generator
        const line = d3.line<{ year: number; totalJobs: number }>()
            .x(d => x(d.year))
            .y(d => y(d.totalJobs));

        // Add the x-axis
        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format('d')));

        // Add the y-axis
        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));

        // Append a path for the line with transition. We want to add a duration of 4 sec.
        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 1.5)
            .attr('d', line)
            .attr('stroke-dasharray', function () { return this.getTotalLength(); })
            .attr('stroke-dashoffset', function () { return this.getTotalLength(); })
            .transition()
            .duration(3000)
            .attr('stroke-dashoffset', 0);

    }, [data]);

    return <svg ref={svgRef} width={500} height={300}></svg>;
};

export default LineGraph;
