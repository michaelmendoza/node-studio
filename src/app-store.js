
import Graph from "./graph.js";

class AppStore {
	constructor() {
		this.graph = new Graph('#app-chart');
	}
	
	addNode(nodeType) {
		this.graph.addNode(nodeType);
	}
}

export default new AppStore();