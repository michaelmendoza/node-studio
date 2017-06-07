
class Node {
	
	constructor(svg, props) {
		this.x = props.x;
		this.y = props.y;
		this.width = props.width || 140;
		this.height = props.heights || 140;
		this.title = props.title;
		this.input = props.input;
		this.output = props.output;

		this.portCount = 0;

		this.createNode(svg);
	}

	createNode(svg) {
		var g = svg.append("g");
		g.attr("transform", "translate(" + this.x + "," + this.y + ")");

		this.createNodeBox(g);
		this.createTitle(g);
		this.input.forEach((item)=> {
			this.createNodeInput(g, item);
		})
		this.output.forEach((item)=> {
			this.createNodeOutput(g, item);
		})
	}

	createNodeBox(g) {
		g.append("rect")
		    .attr("x", 0).attr("y", 0)	    
		    .attr("width", this.width).attr("height", this.height)
		    .attr("rx", 6).attr("ry", 6)
		    .attr("fill", '#F7F7F7')
		    .style("filter", "url(#drop-shadow)")
	}

	createTitle(g) {
		g.append('text')
			.attr("x", this.width / 2).attr("y", 20)
			.attr("fill", "#222222")
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "central")
			.style("font-size", "18px")
			.text(this.title)
	}

	createNodeInput(g, input) {
		input.node = this;
		input.xOffset = 0;
		input.yOffset = 50 + this.portCount++ * 20;

		g.append('circle')
			.attr('cx', input.xOffset)
			.attr('cy', input.yOffset)
			.attr('r', 4)
			.attr('fill', '#0024BA')    
			.attr("stroke", "#222222")
		  .attr("stroke-width", 1)	

		g.append('text')
			.attr("x", 10).attr("y", input.yOffset)
			.attr("fill", "#222222")
			.attr("text-anchor", "start")
			.attr("alignment-baseline", "central")
			.style("font-size", "12px")
			.text(input.name)	 
	}

	createNodeOutput(g, output) {
		output.node = this;
		output.xOffset = this.width;
		output.yOffset = 50 + this.portCount++ * 20;

		g.append('circle')
			.attr('cx', output.xOffset)
			.attr('cy', output.yOffset)
			.attr('r', 4)
			.attr('fill', '#0024BA')    
			.attr("stroke", "#222222")
		  .attr("stroke-width", 1)	

		g.append('text')
			.attr("x", this.width - 10).attr("y", output.yOffset)
			.attr("fill", "#222222")
			.attr("text-anchor", "end")
			.attr("alignment-baseline", "central")
			.style("font-size", "12px")
			.text(output.name)	 
	}

}

export default Node;

