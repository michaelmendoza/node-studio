
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
        this.view = {
            update: 0,      // Check if view needs update i.e. session has run 
            dims: [],       // Shape labels i.e. [depth, height, width, coils, phase_cycles]
            shape: [],      // Data shape i.e. [180, 360, 360, 4, 8]
            indices: [],    // Indices for view
            colormap: 'bw', // Colormap
            isComplex: false,
            contrast: {
                useContrast: false,
                resolution: 4096,
                window: 4096.0,
                level: 2048.0
            },
            get hasData() { return this.shape?.length > 0 },
            init: (view_metadata) => { 
                if (!view_metadata) return;
                this.view.shape = view_metadata.shape;
                this.view.dims = view_metadata.dims;
                this.view.indices = this.view.shape?.map(s => Math.floor(s / 2));
                this.view.isComplex = view_metadata.isComplex
            },
            updateIndex: (index, value) => {
                const indices = [...this.view.indices];
                indices[index] = value;
                this.view.indices = indices;
            },
            updateIndex3d: (x, y, z) => {
                const indices = [...this.view.indices];
                indices[0] = z;
                indices[1] = y;
                indices[2] = x;
                this.view.indices = indices;
            }
        }
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
