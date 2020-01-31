import React, { useState } from 'react';

var NodeType = {
  IMAGE:0,
  ADD:1,
  MASK:2,
  FIT:3
}

var NodeTypeList = {
  [NodeType.ADD]: { name:'Add', input:['A', 'B'], output:['Out']},
  [NodeType.IMAGE]: { name:'Image', input:[], output:['Out']},
  [NodeType.MASK]: { name:'Mask', input:['In', 'Mask'], output:['Out']},
  [NodeType.FIT]: { name:'Fit', input:['In'], output:['Out']}
}

class NodeData {
  constructor(nodeType) {
    var info = NodeTypeList[nodeType]
    this.name = info.name;
    this.input = info.input;
    this.output = info.output;
    this.image = null;
  }
}

var NodesActiveDict = {
  'node-add-0': null
}

const NodeInputs = (props) => <div className="node_input flex-50"> 
  { 
    props.node.input.map((item, index) => {
      return <div key={index} className="node_io-item layout-row flex"> 
          <div className="node_io-point"></div> 
          <div className="node_io-text flex"> {item} </div>
      </div>
    }) 
  }
</div>

const NodeOutput = (props) => <div className="node_output flex-50"> 
  { 
    props.node.output.map((item, index) => {
      return <div key={index} className="node_io-item layout-row flex"> 
          <div className="node_io-text flex"> {item} </div>
          <div className="node_io-point"></div> 
      </div>
    }) 
  }
</div>

const NodeIO = (props) => <div className="node_io layout-row flex" > 
    <NodeInputs node={props.node}></NodeInputs>
    <NodeOutput node={props.node}></NodeOutput>
</div>

const NodeTitle = (props) => <div className="node_title"> {props.name} </div>

const NodeProps = (props) => <div> </div>

class Canvas extends React.Component {
  componentDidMount() {
    const canvas = this.refs.canvas
    const ctx = canvas.getContext("2d")

    var img = new Image();
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
        console.log('test');
    }
    img.src = 'https://picsum.photos/200/200';
  }

  render() {
    return(
      <div>
        <canvas id='image-canvas' ref="canvas" width={180} height={180} />
      </div>
    )
  }
}

const NodeImage = (props) => <div className='node_image'> 
    <Canvas></Canvas>
</div>

const Node = (props) => <div className='node'>
 <NodeTitle name={props.node.name}></NodeTitle>
 <NodeIO node={props.node}></NodeIO>
 <NodeImage></NodeImage>
</div>


const Graph = () => { 

  return (
    <div className="node-blueprint">  
      <Node node={new NodeData(NodeType.ADD)}></Node>
    </div>
  );
} 


export default Graph;
