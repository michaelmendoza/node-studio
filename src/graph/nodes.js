
import ImageNode from './node-image.js';

class Nodes {

	constructor() {
		this.activeNode = null;
		this.nodes = [];
		
		/*
		ImageNode.on('filesloaded', () => {
			var node = this.activeNode;
			var imgsrc = ImageNode.getLatestImage();
			node.file = ImageNode.getLastestFile();
			node.img = node.file.img;
			node.createImg(imgsrc);
		}) 		
		*/	
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
		this.viewport =  viewNodes.map((viewNode) => {
			return viewNode.runNode(); 
		}) 
		return this.viewport;
	}

	render(svg) {
		this.nodes.forEach((node) => {
			node.createNode(svg);
		});
	}
}

var nodes = new Nodes();
window.nodes = nodes;

export default nodes;
