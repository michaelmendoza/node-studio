import * as d3 from 'd3';

export const createTooltip = () => {
    let tooltip = d3.select('body .charts-d3-tooltip');
    tooltip = tooltip.empty() ? d3.select('body').append('div') : tooltip;
    tooltip.attr('class', 'charts-d3-tooltip')				
        .style('opacity', 0)
        .style('display', 'block');
    tooltip.append('div').attr('class', 'tooltip-text');
    tooltip.append('div').attr('class', 'tooltip-text');
    return tooltip;
};

export const updateTooltip = ({ elements, data, labels, onMouseOver = () => {}, onMouseOut = () => {} }) => {
     
    const tooltip = d3.select('body .charts-d3-tooltip');
    elements.data(data)
        .on('mouseover', function (e, d) {
            onMouseOver(this);
            
            tooltip.style('left', (e.pageX + 15) + 'px')		
                .style('top', (e.pageY - 28) + 'px')
                .transition()		
                .duration(200)		
                .style('opacity', 0.9);		

            const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric' };
            const yLabelText = labels?.y ? labels.y : '';
            const yLabel = labels?.y ? yLabelText + ': ' + d.y : d.y;
            const xisDate = data[0].x instanceof Date;
            const xDateLabel = 'Date: ' + (new Date(d.x)).toLocaleString('en-US', options);
            const xLabel = xisDate ? xDateLabel : labels?.x ? labels.x + ': ' + d.x : d.x;

            tooltip.selectAll('div')
                .data([yLabel, xLabel])
                .text(d => d)
                .enter()
                .append('div')
                .text(d => d);
        }) 
        .on('mouseout', function () {
            onMouseOut(this);
            
            tooltip.transition()		
                .duration(200)		
                .style('opacity', 0);
        });
};

export const updatePieTooltip = ({ elements, data, labels, onMouseOver = () => {}, onMouseOut = () => {}, dataTransform = (x) => x }) => {
     
    const tooltip = d3.select('body .charts-d3-tooltip');
    elements.data(dataTransform(data))
        .on('mouseover', function (e, d) {
            onMouseOver(this);
            
            tooltip.style('left', (e.pageX + 15) + 'px')		
                .style('top', (e.pageY - 28) + 'px')
                .transition()		
                .duration(200)		
                .style('opacity', 0.9);		

            const yLabelText = labels?.y ? labels.y : '';
            const yLabel = labels?.y ? yLabelText + ': ' + d.value : d.value;

            tooltip.selectAll('div')
                .data([yLabel, ''])
                .text(d => d)
                .enter()
                .append('div')
                .text(d => d);
        }) 
        .on('mouseout', function () {
            onMouseOut(this);
            
            tooltip.transition()		
                .duration(200)		
                .style('opacity', 0);
        });
};