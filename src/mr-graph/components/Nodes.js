import React, { useEffect, useContext } from 'react';
import { GraphContext } from '../contexts/GraphContext';
import NodeCompute, {NodeType} from './NodeCompute';
import NodeUI from './NodeUI';

const Nodes = () => {
    const { nodes, setNodes, updateNodes, updateSession, setUpdateNodes } = useContext(GraphContext);
    
    useEffect(() => { CreateGraph(); }, [])
    useEffect(() => { console.log('Update Nodes ...'); }, [updateNodes])
    useEffect(() => { console.log('Update Session ...'); RunSession(); }, [updateSession])
    
    const CreateNode = (nodeType, x , y) => {
      return (...inputs) => {
        let node = new NodeCompute({nodeType, x, y, inputs});
        nodes.push(node);
        setNodes(nodes);
        return node;
      }
    }
    
    /** Create a template graph  */
    const CreateGraph = () => {
        var x = CreateNode(NodeType.IMAGE, 100, 100)()
        var x2 = CreateNode(NodeType.IMAGE, 100, 450)()
        var a = CreateNode(NodeType.ADD, 400, 100)(x, x2);
        var d = CreateNode(NodeType.DISPLAY, 700, 100)(a)
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
        console.log("RunSession");
        const operation = nodes.filter( (n) => n.nodeType == NodeType.DISPLAY );
        operation.forEach( (op) => {
            let nodes = ComputeOrder(op)
            nodes.forEach( (n) => n.compute() );
        })
        setUpdateNodes();
    }

    return (
        <div className="nodes">  
            { nodes.map( (n, i) => <NodeUI key={i} node={n}></NodeUI> ) }  
        </div>
      );
}

export default Nodes;