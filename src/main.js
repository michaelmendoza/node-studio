
console.log('GraphNode -','Version: 0.0.1', 'Date:June 5, 2017');

import CSS from "./main.scss";

chart('#test-chart');

function chart(id, data, props) {
	props = props || {};
	var width = props.width || 800;
	var height = props.height || 600;
	var margin = { top: 10, right: 10, bottom: 10, left: 10 };

	var svg = d3.select(id).append("svg")

	svg.attr("width", width)
		.attr("height", height)		
		.attr("class", "svg-chart");	

	createShadowFilter(svg);
	createNode(svg, { x:10, y:10 });
	createNode(svg, { x:230, y:10 });
}

function createNode(svg, props) {
	var width = 200;
	var height = 200;

	var g = svg.append("g");
	g.attr("transform", "translate(" + props.x + "," + props.y + ")");

	g.append("rect")
	    .attr("x", 0).attr("y", 0)	    
	    .attr("width", width).attr("height", height)
	    .attr("rx", 6).attr("ry", 6)
	    .attr("fill", '#F7F7F7')
	    .style("filter", "url(#drop-shadow)")

	// Title
	g.append('text')
		.attr("x", 100).attr("y", 20)
		.attr("fill", "#222222")
		.attr("text-anchor", "middle")
		.attr("alignment-baseline", "central")
		.style("font-size", "18px")
		.text("Node")

	//
	g.append('circle')
		.attr('cx', width)
		.attr('cy', 40)
		.attr('r', 4)
		.attr('fill', '#0024BA')    
		.attr("stroke", "#222222")
	  .attr("stroke-width", 1)	

	g.append('text')
		.attr("x", width - 10).attr("y", 40)
		.attr("fill", "#222222")
		.attr("text-anchor", "end")
		.attr("alignment-baseline", "central")
		.style("font-size", "12px")
		.text("Magnitude")	  	
}

function createShadowFilter(svg) {
	// filters go in defs element
	var defs = svg.append("defs");

	// create filter with id #drop-shadow
	// height=130% so that the shadow is not clipped
	var filter = defs.append("filter")
	    .attr("id", "drop-shadow")
	    .attr("height", "130%");

	// SourceAlpha refers to opacity of graphic that this filter will be applied to
	// convolve that with a Gaussian with standard deviation 3 and store result
	// in blur
	filter.append("feGaussianBlur")
	    .attr("in", "SourceAlpha")
	    .attr("stdDeviation", 3)

	// translate output of Gaussian blur to the right and downwards with 2px
	// store result in offsetBlur
	filter.append("feOffset")
	    .attr("dx", 2)
	    .attr("dy", 2)
	    .attr("result", "offsetBlur");

	// Control opacity of shadow filter
	var feTransfer = filter.append("feComponentTransfer");

	feTransfer.append("feFuncA")
		.attr("type", "linear")
		.attr("slope", 0.2)

	// overlay original SourceGraphic over translated blurred opacity by using
	// feMerge filter. Order of specifying inputs is important!
	var feMerge = filter.append("feMerge");

	feMerge.append("feMergeNode")
	feMerge.append("feMergeNode")
	    .attr("in", "SourceGraphic");	
}



