import Node from './Node';
import Link from './Link';

class Graph {

    constructor(graph = {}) {
        this.id = graph.id || crypto.randomUUID();
        this.name = graph.name || this.id;
        this.description = graph.description || '';
        this.updatedAt = (new Date()).getTime();

        this.nodes = graph.nodes || {}
        this.links = graph.links || []
        this.sessions = graph.sessions || {}
    }

    static readJson(json_string) {
        const graphData = JSON.parse(json_string);
       
        const nodes = graphData.nodes.map(nodeData => {
            return Node.factory(nodeData);
        });
        const nodeDict = {};
        nodes.forEach(node => nodeDict[node.id] = node);

        const links = graphData.links.map(linkData => {
            return new Link(linkData);
        })

        return { nodes: nodeDict, links };
    }

    static exportJson(graph) {
        const nodes = Object.values(graph.nodes).map((node) => Node.export(node));
        const links = graph.links;
        const output = JSON.stringify({ nodes, links });
        return output;
    }

}

export default Graph;