
import ContextMenu from './context-menu.js';
import Link from './link.js';
import Links from './links.js';
import Nodes from './nodes.js';
import Port from './port.js';
import Ports from './ports.js';

import ImageFileStore from './lib/lib.js';

class Node {
	
	constructor(svg, props) {

		this.svg = svg;
		this.x = props.x;
		this.y = props.y;
		this.width = props.width || 140;
		this.height = props.heights || 140;
		this.title = props.title;
		this.input = props.input;
		this.output = props.output;

		this.isDragged = false;
		this.creatingLink = false;
		this.portCount = 0;

		this.id = 'node-' + Nodes.nodes.length;
		this.createNode(svg);
		Nodes.addNode(this);
	}

	createNode(svg) {
		var g = svg.append("g");
		this.g = g;
		g.attr("transform", "translate(" + this.x + "," + this.y + ")")
		 .attr("class", this.id)

		this.createNodeBox(g);
		this.createTitle(g);
		this.createGrip(g, svg);
		this.input = this.input.map((item) => {
			return this.createNodeInput(g, item);
		})
		this.output = this.output.map((item) => {
			return this.createNodeOutput(g, item);
		})
	}

	removeNode() {
		this.g.remove();
	}

	createNodeBox(g) {
		var box = g.append("rect")
			.attr("x", 0).attr("y", 0)	    
			.attr("width", this.width).attr("height", this.height)
			.attr("rx", 6).attr("ry", 6)
			.attr("fill", '#F7F7F7')
			.style("filter", "url(#drop-shadow)")
			.on("contextmenu", () => {
				var m = d3.mouse(this.svg.node()); 
				var removeNode = Nodes.removeNode.bind(Nodes, this); 
				ContextMenu.create(this.svg, m[0], m[1], removeNode);
			})

		this.box = box;

		if(this.title == 'Image') {
			box.on("dragover", this.nodeDragOver.bind(this));
			box.on("drop", this.nodeDrop.bind(this));			
		}
	}	

	nodeDragOver() {
			d3.event.stopPropagation();
			d3.event.preventDefault();
			d3.event.dataTransfer.dropEffect = 'copy';
	}

	nodeDrop() {
			d3.event.stopPropagation();
			d3.event.preventDefault();
			Nodes.setActiveNode(this);
			console.log(this.id);
			
			ImageFileStore.readFile(d3.event);
	}

	createTitle(g) {
		g.append('text')
			.attr("x", this.width / 2).attr("y", 16)
			.attr("fill", "#222222")
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "central")
			.style("font-size", "18px")
			.text(this.title)		
	}

	createGrip(g, svg) {
		var gripX = 10, gripY = 10;
		var grip = g.append("g");
		grip.attr("transform", "translate(" + gripX + "," + gripY + ")");

		var pos = [[4,4], [10,4], [4,10], [10,10]];
		pos.forEach((p)=> {
			grip.append('circle')
				.attr('cx', p[0])
				.attr('cy', p[1])
				.attr('r', 2)
				.attr('fill', '#222222') 
				.attr('opacity', 0.5)
		})

		var grab = grip.append("rect")
			.attr("x", 0).attr("y", 0)	    
			.attr("width", 14).attr("height", 14)
			.attr("fill", '#FFFFFF')
			.attr("opacity", 0)
			.attr("class", "grab")

		// Activate Node drag
		grab.on("mousedown", () => {
			this.isDragged = true;
			this.mouse = d3.mouse(grab.node());

			svg.on("mousemove", (event) => {
				if(this.isDragged) {
					var m = d3.mouse(svg.node());
					this.x = (m[0] - this.mouse[0] - gripX);
					this.y = (m[1] - this.mouse[1] - gripY);
					g.attr("transform", "translate(" + this.x + "," + this.y + ")");

					Links.update();
				}
			})			

			// Deactivate Node drag 
			svg.on("mouseup", () => {
				this.isDragged = false;
			})

			d3.event.preventDefault();
		})	
	}
	
	createNodeInput(g, input) { 
		input = new Port(input);
		input.node = this;
		input.xOffset = 0;
		input.yOffset = 50 + this.portCount++ * 20;

		input.port = g.append('g')
			.attr('class', 'node-input-port')

		input.port.append('circle')
			.attr('cx', input.xOffset)
			.attr('cy', input.yOffset)
			.attr('r', 4)
			.attr('fill', '#0024BA')    
			.attr("stroke", "#222222")
		  .attr("stroke-width", 1)	
		  .attr("cursor", "pointer")
			
		input.port.append('text')
			.attr("x", 10).attr("y", input.yOffset)
			.attr("fill", "#222222")
			.attr("text-anchor", "start")
			.attr("alignment-baseline", "central")
			.style("font-size", "12px")
			.text(input.name)	 

		input.port.on("mouseover", () => {
			input.onHover();
		})

		input.port.on("mouseleave", () => {
			input.offHover();
		})

		return input;
	}

	createNodeOutput(g, output) {
		output = new Port(output);
		output.node = this;
		output.xOffset = this.width;
		output.yOffset = 50 + this.portCount++ * 20;

		output.port = g.append('g')
			.attr('class', 'node-output-port')

		output.port.append('circle')
			.attr('cx', output.xOffset)
			.attr('cy', output.yOffset)
			.attr('r', 4)
			.attr('fill', '#0024BA')    
			.attr("stroke", "#222222")
		  .attr("stroke-width", 1)	
		  .attr("class", "pointer");

		output.port.append('text')
			.attr("x", this.width - 10).attr("y", output.yOffset)
			.attr("fill", "#222222")
			.attr("text-anchor", "end")
			.attr("alignment-baseline", "central")
			.style("font-size", "12px")
			.text(output.name)	

		output.port.on("mousedown", () => {
			this.creatingLink = true;
			Ports.clearActivePort();

			this.newlink = new Link(this.svg, 
				this.output[this.output.indexOf(output)], 
				{mouse: d3.mouse(this.svg.node())}
			);

			this.svg.on("mousemove", () => {
				d3.event.stopPropagation();
				d3.event.preventDefault();

				if(this.creatingLink) {
					this.newlink.end.mouse = d3.mouse(this.svg.node());
					Links.update();
				}
			})

			this.svg.on("mouseup", () => {
				this.creatingLink = false;
				if(Ports.activePort != null)
					this.newlink.end = Ports.activePort;
				else 
					Links.removeLink(this.newlink);
				Links.update();

			})				
		})	

		return output;
	}
}

export default Node;

