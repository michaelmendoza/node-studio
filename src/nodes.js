
import ImageNode from './node-image.js';

class Nodes {

	constructor() {
		this.activeNode = null;
		this.nodes = [];
		
		ImageNode.on('filesloaded', () => {
			console.log('filesloaded');
			var imgsrc = ImageNode.getLatestImage();

			this.activeNode.svg.selectAll('.' + this.activeNode.id)
				.append('image')
				.attr("xlink:href", imgsrc)
				.attr('x', this.activeNode.width / 2 - 40 / 2)
			  .attr('y', 40)
			  .attr('width', 40)
		}) 			
	}

	getNodes() {
		return this.nodes;
	}
	
	addNode(node) {
		this.nodes.push(node);
	}

	removeNode(node) {
		node.removeNode();
		var index = this.nodes.indexOf(node);
		this.nodes.splice(index, 1);
	} 

	update() {

	}

	setActiveNode(node) {
		this.activeNode = node;
	}
}

var nodes = new Nodes();
window.nodes = nodes;

export default nodes;
