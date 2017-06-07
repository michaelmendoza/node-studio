
class Link {
	
	constructor(svg, start, end) {
		this.start = start;
		this.end = end;

		this.createLink(svg);
	}
	
	createLink(svg) {
		var start = this.start;
		var end = this.end;
		var x1 = start.node.x + start.xOffset;
		var y1 = start.node.y + start.yOffset;
		var x2 = end.node.x + end.xOffset;
		var y2 = end.node.y + end.yOffset;

		/*
		svg.append("line")
			.attr("x1", x1)
			.attr("y1", y1)
			.attr("x2", x2)
			.attr("y2", y2)
			.attr("stroke", "#222222")
		  .attr("stroke-width", 1)
		*/

		var bezierLine = d3.line()
			.curve(d3.curveBasis)
	    .x(function(d) { return d[0]; })
	    .y(function(d) { return d[1]; })
	    
	  svg.append("path")
	  	.attr("d", bezierLine([[x1, y1], [(x1+x2)/2, y1], [(x1+x2)/2, (y1+y2)/2], [(x1+x2)/2, y2], [x2, y2]]))  
			.attr("stroke", "#222222")
		  .attr("stroke-width", 1)
		  .attr("fill", "none")

	}
}

export default Link;

