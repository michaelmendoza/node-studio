
import ImageNode from './node-image.js';

class Nodes {

	constructor() {
		this.activeNode = null;
		this.nodes = [];
		
		// TODO: Move img setting/creation to node
		ImageNode.on('filesloaded', () => {
			console.log('filesloaded');
			var imgsrc = ImageNode.getLatestImage();
			this.activeNode.file = ImageNode.getLastestFile();
			this.activeNode.img = this.activeNode.file.img;
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
	
	getViewNodes() {
		return this.nodes.filter((node) => {
			return node.title == 'View'
		})
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

	runNodes() {
		var viewNodes = this.getViewNodes();
		viewNodes.forEach((viewNode) => {
			viewNode.runNode(); 
		}) 
	}
}

var nodes = new Nodes();
window.nodes = nodes;

export default nodes;
