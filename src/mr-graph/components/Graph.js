import React, { useState } from 'react';
import NodeCompute, {NodeType} from './NodeCompute';

/** Computation Graph */
const Graph = () => { 
    let NodeList = [];

    const CreateNode = (nodeType, x , y) => {
      return (...inputs) => {
        let node = new NodeCompute({nodeType, x, y, inputs});
        NodeList.push(node);
        return node;
      }
    }
    
    /** Create a template graph  */
    const CreateGraph = () => {
        var x = CreateNode(NodeType.IMAGE)()
        var x2 = CreateNode(NodeType.IMAGE)()
        var a = CreateNode(NodeType.ADD)(x, x2);
        var d = CreateNode(NodeType.DISPLAY)(a)
    }

    /** Compute traversal order for nodes for a given node */
    const ComputeOrder = (startNode) => { 
        let order = [];
        const recurse = (node) => {
            node.inputs.forEach( (n) => n != null ? recurse(n) : null );
            order.push(node);
        }

        recurse(startNode);
        return order;   
    }

    /** Run a single session for the computation graph  */
    const RunSession = () => {
        const operation = NodeList.filter( (n) => n.nodeType == NodeType.DISPLAY );
        operation.forEach( (op) => {
            let nodes = ComputeOrder(op)
            nodes.forEach( (n) => n.compute() );
        })
    }
    
    CreateGraph();
    RunSession();

    return (
      <div className="node-blueprint">  
         { NodeList.map( (d) => d.nodeUI ) }
      </div>
    );
  } 
  
  export default Graph;
