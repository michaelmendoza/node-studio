
import ContextMenu from './context-menu.js';
import Link from './link.js';
import Links from './links.js';
import Nodes from './nodes.js';
import Port from './port.js';
import Ports from './ports.js';

import ImageNode from './node-image.js';

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
		this.createNode();
		Nodes.addNode(this);
	}

	createNode() {
		this.g = this.svg.append("g");
		this.g.attr("transform", "translate(" + this.x + "," + this.y + ")")
		 .attr("class", this.id)

		this.createNodeBox();
		this.createTitle();
		this.createGrip();
		this.input = this.input.map((item) => {
			return this.createNodeInput(item);
		})
		this.output = this.output.map((item) => {
			return this.createNodeOutput(item);
		})
	}

	removeNode() {
		this.g.remove();
	}

	createNodeBox() {
		var box = this.g.append("rect")
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
			ImageNode.readFile(d3.event);
	}

	createTitle() {
		this.g.append('text')
			.attr("x", this.width / 2).attr("y", 16)
			.attr("fill", "#222222")
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "central")
			.style("font-size", "18px")
			.text(this.title)		
	}

	createGrip() { 
		var gripX = 10, gripY = 10;
		var grip = this.g.append("g");
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

			this.svg.on("mousemove", (event) => {
				if(this.isDragged) {
					var m = d3.mouse(this.svg.node());
					this.x = (m[0] - this.mouse[0] - gripX);
					this.y = (m[1] - this.mouse[1] - gripY);
					this.g.attr("transform", "translate(" + this.x + "," + this.y + ")");

					Links.update();
				}
			})			

			// Deactivate Node drag 
			this.svg.on("mouseup", () => {
				this.isDragged = false;
			})

			d3.event.preventDefault();
		})	
	}
	
	createNodeInput(input) { 
		input = new Port(input);
		input.createInputPort(this);
		return input;
	}

	createNodeOutput(output) { 
		output = new Port(output);
		output.createOutputPort(this);
		return output;
	}
}

export default Node;

