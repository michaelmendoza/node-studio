
import Links from './links.js';

class Link {
	
	constructor(svg, start, end) {
		this.svg = svg;
		this.start = start;
		this.end = end;

		this.link = this.drawLink();
		Links.addLink(this);
	}
	
	getLinkPoints() {
		var x1 = this.start.node.x + this.start.xOffset;
		var y1 = this.start.node.y + this.start.yOffset;
		var x2 = this.end.node.x + this.end.xOffset;
		var y2 = this.end.node.y + this.end.yOffset;
		return [[x1, y1], [(x1+x2)/2, y1], [(x1+x2)/2, (y1+y2)/2], [(x1+x2)/2, y2], [x2, y2]];
	}

	bezierLine() {
		var bezier = d3.line()
			.curve(d3.curveBasis)
	    .x(function(d) { return d[0]; })
	    .y(function(d) { return d[1]; })	

	  return bezier(this.getLinkPoints())
	}
	
	drawLink() {
	  return this.svg.append("path")
	  	.attr("d", this.bezierLine())  
			.attr("stroke", "#222222")
		  .attr("stroke-width", 1)
		  .attr("fill", "none")
	}

	updateLink() {
		var p = this.getLinkPoints();
		this.link.attr("d", this.bezierLine())  
	}
}

export default Link;
