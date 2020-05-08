import React, { useEffect, useContext } from 'react';
import { GraphContext } from '../contexts/GraphContext';
import NodeCompute, {NodeType} from './NodeCompute';
import NodeUI from './NodeUI';
import { removeLink } from './Links';

export const CreateNode = (nodeType, x , y) => {
    return (...inputs) => {
        return new NodeCompute({nodeType, x, y, inputs});
    }
}

export const removeNode = (node, nodes, links) => {
    // Remove links connected to input node
    links.forEach((link) => {
        if(node == link.startNode) removeLink(link);
        if(node == link.endNode) removeLink(link);
    })
    
    // Remove input/output connection to this node
    nodes.forEach((_node) => {
        _node.inputs = _node.inputs.filter( n => n !== node )
        _node.outputs = _node.outputs.filter( n => n !== node )
    })
}

const Nodes = (props) => {
    const { nodes, updateNodes, updateSession, setUpdateNodes } = useContext(GraphContext);
    
    useEffect(() => { console.log('Update Nodes ...'); }, [updateNodes])
    useEffect(() => { console.log('Update Session ...'); RunSession(); }, [updateSession])
        
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
            { nodes.map( (n, i) => <NodeUI key={i} node={n} handleContextMenu={props.handleContextMenu}></NodeUI> ) }  
        </div>
      );
}

export default Nodes;