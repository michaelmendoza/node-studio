
import ImageFileStore from './lib/lib.js';

class Nodes {

	constructor() {
		this.activeNode = null;
		this.nodes = [];

		ImageFileStore.on('filesloaded', () => {
			console.log('filesloaded');
			var i = ImageFileStore;
			var imgsrc = i.files[i.files.length-1].img.src;

			this.activeNode.svg.selectAll('.' + this.activeNode.id)
				.append('image')
				.attr("xlink:href", imgsrc)
				.attr('x', this.activeNode.width / 2 - 40 / 2)
			  .attr('y', 40)
			  .attr('width', 40)
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
}

export default new Nodes();
