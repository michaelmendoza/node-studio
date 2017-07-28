
import { event, mouse } from 'd3';
import Link from './link.js';
import Links from './links.js';
import Ports from './ports.js';

class Port {
	constructor(props, index) {
		this.name = props.name;
		this.value = props.value;
		this.index = index;
	}

	createInputPort(node) {
		this.node = node;
		this.xOffset = 0;
		this.yOffset = 50 + node.portCount++ * 20;

		this.port = this.node.g.append('g')
			.attr('class', 'node-input-port')

		this.port.append('circle')
			.attr('cx', this.xOffset)
			.attr('cy', this.yOffset)
			.attr('r', 4)
			.attr('fill', '#0024BA')    
			.attr("stroke", "#222222")
		  .attr("stroke-width", 1)	
		  .attr("cursor", "pointer")
			
		this.port.append('text')
			.attr("x", 10).attr("y", this.yOffset)
			.attr("fill", "#222222")
			.attr("text-anchor", "start")
			.attr("alignment-baseline", "central")
			.style("font-size", "12px")
			.text(this.name)	 

		this.port.on("mouseover", () => {
			this.onHover();
		})

		this.port.on("mouseleave", () => {
			this.offHover();
		})
	}

	createOutputPort(node) { 
		this.node = node;
		this.xOffset = node.width;
		this.yOffset = 50 + node.portCount++ * 20;

		this.port = node.g.append('g')
			.attr('class', 'node-output-port')

		this.port.append('circle')
			.attr('cx', this.xOffset)
			.attr('cy', this.yOffset)
			.attr('r', 4)
			.attr('fill', '#0024BA')    
			.attr("stroke", "#222222")
		  .attr("stroke-width", 1)	
		  .attr("class", "pointer");

		this.port.append('text')
			.attr("x", node.width - 10).attr("y", this.yOffset)
			.attr("fill", "#222222")
			.attr("text-anchor", "end")
			.attr("alignment-baseline", "central")
			.style("font-size", "12px")
			.text(this.name)	

		this.port.on("mousedown", () => {
			node.creatingLink = true;
			Ports.clearActivePort();

			node.newlink = new Link(
				node.svg, 
				node.outputport[this.index], 
				{mouse: mouse(node.svg.node())}
			);

			node.svg.on("mousemove", () => {
				event.stopPropagation();
				event.preventDefault();

				if(node.creatingLink) {
					node.newlink.end.mouse = mouse(node.svg.node());
					Links.update();
				}
			})
			
			node.svg.on("mouseup", () => {
				node.creatingLink = false;
				if(Ports.activePort != null) {
					node.newlink.end = Ports.activePort;
					// Set output link
					node.output[this.index].link = node.newlink;
					// Set input link
					var port = node.newlink.end;
					port.node.input[port.index].link = node.newlink;
				}
				else 
					Links.removeLink(node.newlink);
				Links.update();

			})				
		})	
	}

	onHover() {
		this.port.selectAll('circle').attr('r', 6);
		Ports.setActivePort(this);
	}

	offHover() {
		this.port.selectAll('circle').attr('r', 4);
	}
}

export default Port;