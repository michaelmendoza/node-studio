
import ContextMenu from './context-menu.js';
import Links from './links.js';

class Link {
	
	constructor(svg, start, end) {
		this.svg = svg;
		this.start = start;
		this.end = end;
		this.name = "link-" + Links.links.length;

		this.link = this.drawLink();
		Links.addLink(this);
	}
	
	getLinkPoints() {
		var x1 = this.start.node.x + this.start.xOffset;
		var y1 = this.start.node.y + this.start.yOffset;
		
		if(this.end.mouse) {
			x2 = this.end.mouse[0];
			y2 = this.end.mouse[1];
		}
		else {
			var x2 = this.end.node.x + this.end.xOffset;
			var y2 = this.end.node.y + this.end.yOffset;			
		}
		
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
	  var link = this.svg.append("path")
	  	.attr("d", this.bezierLine())  
			.attr("stroke", "#222222")
		  .attr("stroke-width", 2)
		  .attr("fill", "none")
		  .attr("class", this.name)

		link.on('mouseover', () => {
			link.attr("stroke", "#0024BA")
				.attr("stroke-width", 3)
		})

		link.on('mouseleave', () => {
			link.attr("stroke", "#0024BA")
				.attr("stroke-width", 2)
		})

		link.on('contextmenu', () => {
			d3.event.stopPropagation();
			d3.event.preventDefault();

			var m = d3.mouse(this.svg.node());
			ContextMenu.create(this.svg, m[0], m[1], this.removeLink.bind(this));
		})

		return link;
	}

	updateLink() {
		var p = this.getLinkPoints();
		this.link.attr("d", this.bezierLine())  
	}

	removeLink() {
		this.svg.selectAll("path." + this.name).remove();
	}
}

export default Link;
