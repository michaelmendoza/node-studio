import Graph from "../graph/graph.js";
import ImageFileStore from './lib/lib.js';

class AppStore {
	constructor() {
		this.graph = new Graph('#app-mainview', { width: 1200, height: 1200});
		this.graph.setImageLoader(ImageFileStore);
	}
	
	addNode(nodeType) {
		this.graph.addNode(nodeType);
	}

	runGraph() {
		this.graph.runGraph();
	}

	queryGraph() {
		return this.graph.queryGraph();
	}	
}

export default new AppStore();