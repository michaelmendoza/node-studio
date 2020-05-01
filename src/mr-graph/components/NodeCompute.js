import NodeUI from './NodeUI';

export const NodeType = {
  IMAGE:'Image',
  ADD:'Add',
  MASK:'Mask',
  FIT:'Fit',
  DISPLAY:'Display'
}

export const NodeInfo = {
  [NodeType.ADD]: { name:'Add', input:['A', 'B'], output:['Out'], fn:(a,b)=> a+b },
  [NodeType.IMAGE]: { name:'Image', input:[], output:['Out']}, 
  [NodeType.DISPLAY] : { name:'Display', input:['In'], output:[], fn:(a) => a},
  [NodeType.MASK]: { name:'Mask', input:['In', 'Mask'], output:['Out']},
  [NodeType.FIT]: { name:'Fit', input:['In'], output:['Out']}
}

/** Represents a node that performs a computation operation in a computation graph */ 
class NodeCompute {
  constructor({ nodeType, x = 0, y = 0, inputs = [] }) {
    // Properties for Node UI
    var info = NodeInfo[nodeType]
    this.nodeType = nodeType;
    this.name = info.name;
    this.inputLabels = info.input;
    this.outputLabels = info.output;
    this.position = { x:x, y:y };
    this.nodeUI = NodeUI({ node:this })

    // Properties for Node compute
    this.inputs = inputs;   // List input nodes
    this.outputs = [];      // List of consumers i.e. nodes that recieve this node as an input
    this.image = null;
    this.data = 1;
    this.fn = info.fn;

    // Append this node to the list of outputs for each input 
    inputs.forEach( input => input.outputs.push(this) )
  }

  /** Compute */
  compute() {
    if(this.fn != null) {
      let data = this.inputs.map( (n) => n.data );
      this.data = this.fn(...data);
    }
    
    let debugString = this.data != null ? this.data.toString() : "";
    console.log(this.name + " :" + debugString);
  } 
}

export default NodeCompute;
