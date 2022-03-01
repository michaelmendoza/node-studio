
import { getNodeFromType } from './NodeList';

class Node {

    constructor(node) {
        this.id = node.id || crypto.randomUUID();       // UUID for node
        this.position = {};
        this.position.x = node.position?.x || 0;        // X position of node
        this.position.y = node.position?.y || 0;        // Y position of node
        this.type = node.type || 'Test';
        this.name = node.name || 'Test';                // NodeType
        this.inputs = node.input || [];                 // Input Labels
        this.outputs = node.output || [];               // Output Labels
        this.options = node.options || [];              // Options Labels
        this.argsDict = node.args || {};                // Argument Dict for Node compute
    }

    static create(type, position = { x: 50, y:50 }) {
        const nodeDict = getNodeFromType(type);
        const node = new Node( { ...nodeDict, position } );
        return node;
    }

    /** Creates Node from nodeData with data structure outlined in nodestudio (python) */
    static factory(nodeData) {
        const node = {}
        node.id = nodeData.id;
        node.position = { x: nodeData.props.x, y: nodeData.props.y }
        node.type = nodeData.props.type;
        node.name = nodeData.props.name;
        node.input = nodeData.props.input;
        node.output = nodeData.props.output;
        node.options = nodeData.props.options;
        node.args = nodeData.props.args;
        return new Node(node);
    }
}

export default Node;

/*
inputs: []
output: ['4ce1c07c8a1211ec8516acde48001122']
props:
args: {filetype: 'dicom', filepath: '/Users/michael/projects/MRI/data/foot_data/'}
input: []
options: (2) ['filetype', 'filepath']
output: ['out']
type: "FILE"
x: 100
y: 100
*/