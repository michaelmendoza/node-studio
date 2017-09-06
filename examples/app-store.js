import Graph from "../src/graph.js";
import ImageFileStore from './lib/lib.js';

class AppStore {
	constructor() {
		this.graph = new Graph('#app-chart', { width: 1200, height: 1200});
		this.graph.setImageLoader(ImageFileStore);
	}
	
	addNode(nodeType) {
		this.graph.addNode(nodeType);
	}
}

export default new AppStore();