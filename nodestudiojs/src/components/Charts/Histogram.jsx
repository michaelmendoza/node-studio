import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';
import { PropTypes } from 'prop-types';

/**
 * Takes an array of data and histogram bins the data, then plots a svg bar 
 * chart using d3. Data is input as a array of number. 
 * 
 * example:
 * <HistogramChart width={500} height={500} data={[{x0:0, x1:1, y:0}, {x0:1, x1:2, y:5}, {x0: 2, x1:3, y:1}, {x0: 3, x1:4, y:2}]}></HistogramChart>
 * @param {{width, height, data}} props { width, height, data } 
 */
const HistogramChart = (props) => {
    
    const self = useRef({ svg: null }); 
    const d3Container = useRef(null);
    const margin = { top: 20, right: 40, bottom: 30, left: 40 };
    const fillColor = '#2196F3'; //'#89D7F9'; 
    const duration = 500;
    const delay = 500;

    // Get Scale
    const width = props.width - margin.left - margin.right;
    const height = props.height - margin.top - margin.bottom;

    useEffect(() => {
        const data = props.data;
        initChart(data);
        updateSize();
        updateChart(data);
        renderChart(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.data, props.width]);

    const initChart = (data) => {
        if (self.current.svg) return;

        // Add margins to graph     
        const svg = d3.select(d3Container.current);
        const g = svg.append('g')
            .attr('class', 'histogramchart')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
                
        // Get x scale
        const xmax = data[data.length-1].x1;
		const x = d3.scaleLinear()
			.domain([0, xmax])
            .range([0, width]);

        // Get y scale 
        const ymax = d3.max(data, (d) => d.y);
		const y = d3.scaleLinear()
			.domain([0, ymax])
			.range([height, 0]);

        // Create an axis component with d3.axisBottom
        const xAxis = svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(' + margin.left + ',' + (height + margin.top) + ')')
            .attr('opacity', '0.75')
            .call(d3.axisBottom(x).tickFormat(d3.format('.5'))); 
        
        // Create an axis component with d3.axisLeft       
        const yAxis = svg.append('g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(' + (margin.left) + ', ' + margin.top + ')')
            .attr('opacity', '0.75')
            .call(d3.axisLeft(y).tickFormat(d3.format('.5'))); 
        
        self.current = { svg, g, x, y, xAxis, yAxis };
    }

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
    }

    const updateChart = (data) => {

        const { x, y, xAxis, yAxis } = self.current;

		// Min and Max Values
		const ymin = 0;
        const ymax = d3.max(data, (d) => d.y);
        const xmin = 0;
        const xmax = data[data.length-1].x1;

        // Update x, y scale
        x.domain([xmin, xmax]);
		y.domain([ymin, ymax]);

        // Update x,y axis
        const xAxisRef = xAxis.transition().duration(800);
        xAxisRef.call(d3.axisBottom(x).tickFormat(d3.format('.5')));
        yAxis.transition().duration(800).call(d3.axisLeft(y).tickFormat(d3.format('.5')));
        xAxis.selectAll('.tick text')	
            .style('text-anchor', 'end')
            .attr('dx', '-.5em')
            .attr('dy', '.5em')
            .attr('transform', 'rotate(-35)');
    };

    const renderChart = (data) => {

        const { g, x, y } = self.current;

        // Update and Draw Bars 
        const bars = g.selectAll('rect').data(data);
        bars.exit() // Update bars that are removed
            .transition().duration(duration)
            .attr('height', () => height - y(0)) 
            .attr('y', () => y(0))
            .attr('fill-opacity', 1)
            .remove();
        bars.transition().duration(duration) // Update bars that aren't removed 
            .attr('y', (d) => y(d.y))
            .attr('height', (d) => height - y(d.y))
            .attr('x', (d) => x(d.x0))
            .attr('width', (d) => x(d.x1) - x(d.x0))
            .attr('fill-opacity', 1)
        bars.enter().append('rect') // Initialize new bars
            .attr('height', () => height - y(0)) 
            .attr('y', () => y(0))
            .attr('x', (d) => x(d.x0))
            .attr('width', (d) => x(d.x1) - x(d.x0))
            .attr('fill', fillColor)
            .attr('fill-opacity', 1)        
        .transition()
            .duration(duration) // Update new bars
            .attr('y', (d) => y(d.y))
            .attr('height', (d) => height - y(d.y))
            .attr('x', (d) => x(d.x0))
            .attr('width', (d) => x(d.x1) - x(d.x0))
            .attr('fill-opacity', 1)
            .delay((d, i) => (i * delay / data.length));

    }

    return (
        <div>  
            <svg ref={d3Container} width={props.width} height={props.height}>
            </svg>
        </div>
    );
};

HistogramChart.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    data: PropTypes.array
  };

export default HistogramChart;