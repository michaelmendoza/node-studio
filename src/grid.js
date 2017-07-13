
import Nodes from './nodes.js';

/**
 * Semi-smart method for node inital placement so nodes aren't overlapping
 */
 
class Grid {
	
	constructor(width, height, N) {
		this.N = N || 10;
		this.width = width;
		this.height = height;
		this.dx = this.width / (this.N - 1);;
		this.dy = this.height / (this.N - 1);
		this.margin = 10;
	}

	next() {
		var nodes = Nodes.getNodes();
		
		for(var y = 0; y < this.N; y++) 
			for(var x = 0; x < this.N; x++) {

				var isContained = false;
				nodes.forEach( (node) => {
					var nx = node.x / this.dx;
					var ny = node.y / this.dy;
					var nx2 = (node.x + node.width) / this.dx;
					var ny2 = (node.y + node.height) / this.dy;
					if( x <= nx2 &&  nx < x + 1 && y <= ny2 && ny < y + 1)
						isContained = true; 
				})

				if(!isContained)
					return { x: x * this.dx + this.margin, y: y * this.dy + this.margin }
			}
	}

}

export default Grid;