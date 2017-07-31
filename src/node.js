
import ContextMenu from './context-menu.js';
import { event, line, mouse } from 'd3';
import ImageMath from "./image-math.js";
import Link from './link.js';
import Links from './links.js';
import NodeActions from './node-actions.js';
import NodeDropdown from './node-dropdown.js';
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
		this.height = props.height || 140;
		this.title = props.title;
		this.input = props.input;
		this.output = props.output;
		this.inputport = null;
		this.outputport = null;

		this.file = null;
		this.img = null;

		this.isDragged = false;
		this.creatingLink = false;
		this.portCount = 0;

		this.id = 'node-' + Nodes.nodes.length;
		this.createNode();
		Nodes.addNode(this);
	}

	createNode(svg) {
		this.svg = svg || this.svg;

		this.g = this.svg.append("g");
		this.g.attr("transform", "translate(" + this.x + "," + this.y + ")")
		 .attr("class", this.id)

		this.createNodeBox();
		this.createTitle();
		this.createGrip();
		this.createNodeDelete();
		this.inputport = this.input.map((item, index) => {
			return this.createNodeInput(item, index);
		})
		this.outputport = this.output.map((item, index) => {
			return this.createNodeOutput(item, index);
		})
	}

	createNodeBox() {
		var box = this.g.append("rect")
			.attr("x", 0).attr("y", 0)	    
			.attr("width", this.width).attr("height", this.height)
			.attr("rx", 6).attr("ry", 6)
			.attr("fill", '#F7F7F7')
			.style("filter", "url(#drop-shadow)")
			.on("contextmenu", () => {
				var m = mouse(this.svg.node()); 
				var removeNode = Nodes.removeNode.bind(Nodes, this); 
				ContextMenu.create(this.svg, m[0], m[1], removeNode);
			})
		
		if(this.title == 'Image') {
			this.createDropdown();
			box.on("dragover", this.nodeDragOver.bind(this));
			box.on("drop", this.nodeDrop.bind(this));			
		}
		if(this.title == 'View') 
			this.createPlaySVG();
	}	

	createNodeDelete() { 
		var b = this.g.append('rect')
			.attr("x", this.width - 20).attr("y", 12)
			.attr("width", 10).attr("height", 10)
			.attr("fill", "#757575")
			.attr("opacity", 0)
		var d = this.g.append('text')
			.attr("x", this.width - 20).attr("y", 22)
			.attr("fill", "#757575")
			.text('x')

		b.on('mouseover', () => { d.attr("fill", "red"); });
		b.on('mouseleave', () => { d.attr("fill", "#757575"); });
		b.on('click', () => { Nodes.removeNode(this); }) 
	}

	removeNode() {
		this.g.remove();
	}

	nodeDragOver() {
			event.stopPropagation();
			event.preventDefault();
			event.dataTransfer.dropEffect = 'copy';
	}

	nodeDrop() {
			event.stopPropagation();
			event.preventDefault();
			Nodes.setActiveNode(this);			
			ImageNode.readFile(event);
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
			this.mouse = mouse(grab.node());

			this.svg.on("mousemove", () => {
				if(this.isDragged) {
					var m = mouse(this.svg.node());
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

			event.preventDefault();
		})	
	}
	
	createNodeInput(input, index) { 
		input = new Port(input, index);
		input.createInputPort(this);
		return input;
	}

	createNodeOutput(output, index) { 
		output = new Port(output, index);
		output.createOutputPort(this);
		return output;
	}

	createDropdown() {
		new NodeDropdown(this);
	}

	createPlaySVG() {
		var playData = [{"x":0, "y":0}, {"x": 10, "y":7}, {"x": 0, "y": 14 }, {"x": 0, "y": 0}];

		var lineFunction = line()
			.x(function(d) { return d.x; })
			.y(function(d) { return d.y; })

		var playSVG = this.g.append("path")
			.attr("d", lineFunction(playData))
			.attr("stroke", "#757575")
			.attr("stroke-width", 1)
			.attr("fill", "#757575")
			.attr("transform", "translate(" + (this.width - 45) + "," + 10 + ")");

		playSVG.on('mouseover', () => { playSVG.style("fill", 'blue') });
		playSVG.on('mouseleave', () => { playSVG.style("fill", '#757575') });
		playSVG.on('click', () => { Nodes.runNodes(); });
	}

	createImg(imgsrc) {
		this.svg.selectAll('.' + this.id)
			.append('image')
			.attr("xlink:href", imgsrc)
			.attr('x', this.width / 2 - 40 / 2)
		  .attr('y', 40)
		  .attr('width', 40)
	}

	getInputNode(index) {
		return this.input[index].link.getInputNode();
	}

	runNode() { 
		return NodeActions.runAction(this.title.toLowerCase(), { node:this });
	}
}

export default Node;

