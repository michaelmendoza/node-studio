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

const NodeInputs = (props) => <div className="node_input"> 
  { 
    props.node.input.map((item, index) => {
      return <div key={index}> {item} </div>
    }) 
  }
</div>

const NodeOutput = (props) => <div className="node_output"> 
  { 
    props.node.output.map((item, index) => {
      return <div key={index}> {item} </div>
    }) 
  }
</div>

const NodeTitle = (props) => <div className="node_title"> {props.name} </div>

const NodeProps = (props) => <div> </div>

const NodeImage = (props) => <div> </div>


const Node = (props) => <div className='node'>
 <NodeTitle name={props.node.name}></NodeTitle>
 <NodeInputs node={props.node}></NodeInputs>
 <NodeOutput node={props.node}></NodeOutput>
 <NodeImage></NodeImage>
</div>

const Graph = () => { 

  return (
    <div>  
      <Node node={new NodeData(NodeType.ADD)}></Node>
    </div>
  );
} 


export default Graph;
