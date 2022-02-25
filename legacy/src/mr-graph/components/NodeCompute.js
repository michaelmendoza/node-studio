import nj from 'numjs';

export const NodeType = {
  IMAGE:'Image',
  ADD:'Add',
  MASK:'Mask',
  FIT:'Fit',
  DISPLAY:'Display'
}

export const NodeInfo = {
  [NodeType.ADD]: { name:'Add', input:['A', 'B'], output:['Out'], fn:(a,b)=> a.add(b) },
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

    // Properties for Node compute
    this.inputs = inputs;   // List input nodes
    this.outputs = [];      // List of consumers i.e. nodes that recieve this node as an input
    this.image = null;
    this.data = null;
    this.fn = info.fn;
    
    // Props UI Section
    this.onLoad = () => { console.log('Loading ...')};
    this.onFileInput = (e) => { console.log('File Input ...'); this.handleFileInput(e); }; 

    // Append this node to the list of outputs for each input 
    inputs.forEach( input => input.outputs.push(this) )
  }
  
  /** Compute */
  compute() {
    if(this.fn != null) {
      let data = this.inputs.map( (n) => n.data );
      var isValidData = true;
      data.forEach( (d) => isValidData = (d == null) ? false : isValidData );
      if(isValidData)
        this.data = this.fn(...data);
    }
    
    let debugString = this.data != null ? this.data.toString() : "";
    console.log(this.name + " :" + debugString);
  } 

  handleFileInput(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    var node = this;
    reader.onload = function(e) {
      node.image = e.target.result;
      node.update.nodes();
    };
    reader.readAsDataURL(file);
  }

  drawMockImage(canvas) {
    const ctx = canvas.getContext("2d")

    var img = new Image();
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
    }
    img.src = 'https://picsum.photos/200/200';
  }

  drawImage(canvas) {
    const ctx = canvas.getContext("2d")

    var img = new Image();
    var node = this;
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
        node.data = nj.images.read(img);
        node.update.session();
    }
    img.src = this.image;
  }

  drawDataToCanvas(canvas) {
    if(this.data !== null) {
      console.log('Render data ...');
      nj.images.save(this.data, canvas);
    }
  }
}

export default NodeCompute;
