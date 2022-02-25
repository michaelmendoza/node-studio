
class Node {

    constructor(node) {
        this.id = node.id;              // UUID for node
        this.position = {};
        this.position.x = node.position.x || 0; // X position of node
        this.position.y = node.position.y || 0; // Y position of node
        this.name = node.name || 'test';        // NodeType
        this.inputs = node.input || ['In'];     // Input Labels
        this.outputs = node.output || ['Out'];  // Output Labels
        this.options = node.options || [];      // Options Labels
        this.argsDict = node.args || {};        // Argument Dict for Node compute
    }

    static load_json(json_string) {

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