
import { getNodeFromType } from './NodeList';

class Node {

    constructor(node) {
        // Node varibles (designed by backend)
        this.id = node.id || crypto.randomUUID();   // UUID for node
        this.inputs = node.inputs || [];            // Input NodeIDs
        this.outputs = node.outputs || [];          // Output NodeIDs
        this.props = node.props || {};
        this.styles = node.styles || {};
        this.args = node.args || {};                // Fn arguments dict for Node compute
    }

    get name() { return this?.props.name || 'Test'; }

    get type() { return this?.props.type || 'Test'; }

    get inputLabels()  { return this?.props.input || []; }

    get outputLabels()  { return this?.props.output || []; }

    get options() { return this?.props.options || []; }

    get position() { return { x: this.styles.x, y: this.styles.y } }

    /** Creates a shallow copy of node */
    copy() {
        return new Node({...this});
    }

    /** Exports node to format need for saving / backend */
    static export(node) {
        const data = {
            id: node.id, 
            props: { type: node.type },
            inputs: node.inputs,
            outputs: node.outputs,
            styles: node.styles,
            args: node.args
        }
        return data;
    }

    /** Create node factory  */
    static create(type, position = { x: 50, y:50 }) {
        const nodeDict = getNodeFromType(type);
        if(nodeDict === undefined) return;
        const node = new Node( { props:nodeDict, styles:position } );
        return node;
    }

    /** Creates Node from nodeData with data structure outlined in nodestudio (python) */
    static factory(nodeData) {
        const node = {}
        node.id = nodeData.id;
        node.inputs = nodeData.inputs;
        node.outputs = nodeData.outputs;
        node.args = nodeData.args;
        node.props = nodeData.props;
        node.styles = nodeData.styles;
        return new Node(node);
    }
}

export default Node;
