import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';
import { PropTypes } from 'prop-types';
import * as ChartToolTip from './ChartTooltip';

/**  List of Available Chart Types */
export const ChartTypes = { 
    'Line': 'Line', 
    'LineArea': 'LineArea'
}

/**
 * Plots a svg line/area chart using d3. Data is input as a point array. 
 * 
 * example: 
 * const _data = Points.gaussianModel(-3, 3, 100, 1, 0.5);
 * <LineAreaChart width={500} height={500} data={_data}></LineAreaChart>
 * @param {{width, height, data}} props { width, height, data } 
 */ 
const LineAreaChart = (props) => {
    
	const self = useRef({ svg: null }); 
    const d3Container = useRef(null);
    const margin = { top: 40, right: 40, bottom: 45, left: 50 };
    const areaColor = '#C7EBFE';
    const lineColor = '#89D7F9';
	const duration = 500;
	const dotFillColor = lineColor; //'#dddddd';
	const dotHoverColor = '#ffffff';
    const dotStrokeColor = '#222222';
    const pointRadius = 3;

	// Get Scale
	const width = props.width - margin.left - margin.right;
	const height = props.height - margin.top - margin.bottom;

	useEffect(() => {
		initChart();
		updateSize();
		updateChart(props.data);
		updateTooltip(props.data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.data, props.width]);

	const initChart = () => {
        if (self.current.svg) return;

        // Add margins to graph   
        const svg = d3.select(d3Container.current);  
        const g = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		// Min and Max Values
		const xmin = d3.min(props.data, (d) => d.x);
		const xmax = d3.max(props.data, (d) => d.x);
		const ymin = d3.min(props.data, (d) => d.y);
		const ymax = d3.max(props.data, (d) => d.y);

        // Get x scale
		const x = d3.scaleLinear()
			.domain([xmin, xmax])
            .range([0, width]);

        // Get y scale 
		const y = d3.scaleLinear()
			.domain([ymin, ymax])
			.range([height, 0]);

        // Create an axis component with d3.axisBottom
        const xAxis = svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(' + margin.left + ',' + (height + margin.top) + ')')
            .call(d3.axisBottom(x).tickFormat(d3.format('.5'))); 
        
        // Create an axis component with d3.axisLeft       
        const yAxis = svg.append('g')
            .attr('class', 'y-axis')
            .attr('transform', 'translate(' + (margin.left) + ', ' + margin.top + ')')
            .call(d3.axisLeft(y).tickFormat(d3.format('.5'))); 
			
        // xAxis Labels
        const xLabelText = props.labels?.x ? props.labels.x : '';
        xAxis.append('text')
            .attr('class', 'axis-title')
            .attr('transform', 'translate(' + (width / 2) + ', 0)')
            .attr('y', (margin.bottom - 3))
            .attr('text-anchor', 'middle')
            //.style("fill", "#444444")
            .text(xLabelText);

        // yAxis Labels
        const yLabelText = props.labels?.y ? props.labels.y : '';
        yAxis.append('text')
            .attr('class', 'axis-title')
            .attr('transform', 'rotate(-90)translate(' + (-height / 2) + ', 0)')
            .attr('y', -(margin.left - 10))
            .attr('text-anchor', 'middle')
            //.style("fill", "#444444")
            .text(yLabelText);

        // Create tooltip 
        ChartToolTip.createTooltip();

		self.current = { svg, g, x, y, xAxis, yAxis };
	};

	const updateSize = () => {
        const { x, y, xAxis, yAxis } = self.current;
                
        // Get x scale
		x.range([0, width]);

        // Get y scale 
		y.range([height, 0]);

        // Create an axis component with d3.axisBottom
        xAxis.call(d3.axisBottom(x).tickFormat(d3.format('.5'))); 
        
        // Create an axis component with d3.axisLeft       
        yAxis.call(d3.axisLeft(y).tickFormat(d3.format('.5'))); 

		// Update axis labels
		xAxis.select('.axis-title').attr('transform', 'translate(' + (width / 2) + ', 0)');
        yAxis.select('.axis-title').attr('transform', 'rotate(-90)translate(' + (-height / 2) + ', 0)');
	};

	const updateChart = (data) => {
        const { x, y, xAxis, yAxis } = self.current;

		// Min and Max Values
		const xmin = d3.min(props.data, (d) => d.x);
		const xmax = d3.max(props.data, (d) => d.x);
		const ymin = d3.min(props.data, (d) => d.y);
		const ymax = d3.max(props.data, (d) => d.y);

		// Update x, y scale
		x.domain([xmin, xmax]);
		y.domain([ymin, ymax]);

        // Update x,y axis
        xAxis.transition().duration(800).call(d3.axisBottom(x).tickFormat(d3.format('.5')));
        yAxis.transition().duration(800).call(d3.axisLeft(y).tickFormat(d3.format('.5')));
        xAxis.selectAll('.tick text')	
            .style('text-anchor', 'end')
            .attr('dx', '-.5em')
            .attr('dy', '.5em')
            .attr('transform', 'rotate(-35)');

		renderChart(data);
	};

	const renderChart = (data) => {
        const { g, x, y } = self.current;

		// Create line chart objects
		const line = d3.line()
			.x((d) => x(d.x))
			.y((d) => y(d.y))
			.curve(d3.curveMonotoneX);

        // Line for start of animation 
		const lineStart = d3.line() 
			.x((d) => x(d.x))
			.y(height)
			.curve(d3.curveMonotoneX);

		const lines = g.selectAll('.line')
			.data([data])
			.attr('class', 'line');
		lines.exit().remove();
		lines.enter().append('path')
				.attr('class', 'line')
				.attr('stroke', lineColor)
				.attr('stroke-width', 1)
				.attr('fill', 'none')				    
				.attr('opacity', '0.8')
				.attr('d', lineStart)
				.transition()
				.duration(duration) 
				.attr('d', line);
		lines.transition()
			.duration(duration)
			.attr('d', line(data));

		if (props.type === ChartTypes.LineArea) {
			// Create area chart objects
			const area = d3.area()
				.x((d) => x(d.x))
				.y0(height)
				.y1((d) => y(d.y))
				.curve(d3.curveMonotoneX);

			// Area for start of animation 
			const areaStart = d3.area() 
				.x((d) => x(d.x))
				.y0(height)
				.y1(height)
				.curve(d3.curveMonotoneX);

			const areas = g.selectAll('.area')
				.data([data])
				.attr('class', 'area');
			areas.exit().remove();
			areas.enter().append('path')
				.attr('class', 'area')
				.attr('fill', areaColor)	
				.attr('opacity', '0.75')
				.attr('d', areaStart)
				.transition()
				.duration(500)
				.attr('d', area);
			areas.transition()
				.duration(duration)
				.attr('d', area(data));
		}

		const dots = g.selectAll('.dot')
            .data(data)
			.attr('class', 'dot');
		dots.exit().remove();
        dots.enter()
            .append('circle')
			.attr('class', 'dot')
			.attr('cx', (d) => x(d.x))
			.attr('cy', height)
			.attr('r', 0)
			.style('fill', dotFillColor)
			.style('stroke', dotStrokeColor)

			// Animation
			.transition()        
			.duration(800)
			.attr('cx', (d) => x(d.x))
			.attr('cy', (d) => y(d.y))
			.attr('r', pointRadius);	
		dots.transition()
			.duration(duration)
			.attr('cx', (d) => x(d.x))
			.attr('cy', (d) => y(d.y));
	};

    const updateTooltip = (data) => {

        const { svg } = self.current;
        const onMouseOver = () => { 
            d3.select(this)
                    .style('fill', dotHoverColor)
                    .attr('r', 2 * pointRadius);
        };
        const onMouseOut = () => {
            d3.select(this)
            .style('fill', dotFillColor)
            .attr('r', pointRadius);
        };
		
        ChartToolTip.updateTooltip({ elements: svg.selectAll('.dot'), data, labels: props?.labels, onMouseOver, onMouseOut });
    };
	
    return (
        <div> 
            <svg ref={d3Container} width={props.width} height={props.height}>
            </svg>
        </div>
    );
};

LineAreaChart.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    data: PropTypes.array,
    labels: PropTypes.object,
	type: PropTypes.string
  };

export default LineAreaChart;