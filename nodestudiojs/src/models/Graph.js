//'{"nodes": [{"id": "4ce1b6d68a1211ec8516acde48001122", "props": {"type": "FILE", "x": 100, "y": 100, "input": [], "output": ["out"], "options": ["filetype", "filepath"], "args": {"filetype": "dicom", "filepath": "/Users/michael/projects/MRI/data/foot_data/"}}, "inputs": [], "output": ["4ce1c07c8a1211ec8516acde48001122"]}, {"id": "4ce1c07c8a1211ec8516acde48001122", "props": {"type": "MASK", "x": 200, "y": 100, "input": ["a"], "output": ["out"], "options": ["masktype"], "args": {"masktype": "circular"}}, "inputs": ["4ce1b6d68a1211ec8516acde48001122"], "output": ["4ce1c7c08a1211ec8516acde48001122"]}, {"id": "4ce1c7c08a1211ec8516acde48001122", "props": {"type": "DISPLAY", "x": 300, "y": 100, "input": ["a"], "output": [], "options": [], "args": {}}, "inputs": ["4ce1c07c8a1211ec8516acde48001122"], "output": []}], "links": [{"id": "4ce1c3068a1211ec8516acde48001122", "startNode": "4ce1b6d68a1211ec8516acde48001122", "endNode": "4ce1c07c8a1211ec8516acde48001122"}, {"id": "4ce1c89c8a1211ec8516acde48001122", "startNode": "4ce1c07c8a1211ec8516acde48001122", "endNode": "4ce1c7c08a1211ec8516acde48001122"}]}'
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