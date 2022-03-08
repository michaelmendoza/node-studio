import Node from './Node';
import Link from './Link';

class Graph {

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

}

export default Graph;