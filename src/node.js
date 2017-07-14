
import ContextMenu from './context-menu.js';
import { event, mouse } from 'd3';
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
		this.height = props.height || 140;
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
				var m = mouse(this.svg.node()); 
				var removeNode = Nodes.removeNode.bind(Nodes, this); 
				ContextMenu.create(this.svg, m[0], m[1], removeNode);
			})
		
		if(this.title == 'Image') {
			this.createDropdown();
			box.on("dragover", this.nodeDragOver.bind(this));
			box.on("drop", this.nodeDrop.bind(this));			
		}
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

	createDropdown() {

		var props = { showDropdown:false };

		var dropdown = this.svg.append("g");
		dropdown.attr("transform", "translate(" + 30 + "," + 120 + ")")
		 .attr("class", 'dropdown')

		var box = dropdown.append("rect")
			.attr("x", 0).attr("y", 0)	 
			.attr("rx", 6).attr("ry", 6)
			.attr("width", 100).attr("height", 20)
			.style("fill", '#FEFEFE')
			.style("stroke", "AAAAAA")
			.style("stroke-width", 1)

		var text = dropdown.append("text")
			.attr("x", 20).attr("y", 14)
			.attr("font-size", 10)
			.text('Select Image')

		box.on('mouseover', () => { box.style("fill", '#CECECE') })
		box.on('mouseleave', () => { box.style("fill", '#FEFEFE') })
		box.on('click', () => { 
			if(!props.showDropdown) {
				var data = ImageNode.getFiles();
				var index = 0;
				data.forEach((d) => { d.index = index++; })

				dropdown.append("rect")
					.attr('class', 'list')
					.attr("x", 0).attr("y", 30)
					.attr("width", 100).attr("height", index * 50 + 10)
					.style("fill", '#FEFEFE')
					.style("filter", "url(#drop-shadow)") 

				var list = dropdown.append('g')
					.attr('class', 'dropdown-list')
					.attr("transform", "translate(" + 30 + "," + 40 + ")")
				var options = list.selectAll('image')
					.data(data)
					.enter()
					.append('image')
					.attr("xlink:href", (d) => { return d.img.src; })
					.attr('x', 0)
				  .attr('y', (d) => { return d.index * 50 })
				  .attr('width', 40)
			}
			else 
				dropdown.selectAll("rect.list").remove();
			
			props.showDropdown = !props.showDropdown;
		})



		/*
		var data = ['a','b','c'];
		var dropDown = this.g.append('select')
			.attr('class', 'selection')
			.attr('name', 'list')
		var options = dropDown.selectAll('option')
			.data(data)
			.enter()
			.append('option')
			.text((d) => { return d })
			.text((d) => { return d })
		*/
	}
}

export default Node;

