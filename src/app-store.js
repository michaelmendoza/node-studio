
import Graph from "./graph.js";
import ImageFileStore from './lib/lib.js';

class AppStore {
	constructor() {
		this.graph = new Graph('#app-chart');
		this.graph.setImageLoader(ImageFileStore);
	}
	
	addNode(nodeType) {
		this.graph.addNode(nodeType);
	}
}

export default new AppStore();