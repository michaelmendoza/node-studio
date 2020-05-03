import React, { useEffect, useContext } from 'react';
import { GraphContext } from '../contexts/GraphContext';
import NodeCompute, {NodeType} from './NodeCompute';

const Nodes = () => {
    const { nodes, addNode, setNodes } = useContext(GraphContext);
    //const [nodes, setNodes] = useState([]);

    useEffect(() => {
        CreateGraph();
        RunSession();
    }, [])
    
    const CreateNode = (nodeType, x , y) => {
      return (...inputs) => {
        let node = new NodeCompute({nodeType, x, y, inputs});
        //addNode(node);
        return node;
      }
    }
    
    /** Create a template graph  */
    const CreateGraph = () => {
        var x = CreateNode(NodeType.IMAGE, 100, 100)()
        var x2 = CreateNode(NodeType.IMAGE, 100, 400)()
        var a = CreateNode(NodeType.ADD, 400, 100)(x, x2);
        var d = CreateNode(NodeType.DISPLAY, 700, 100)(a)
        setNodes([x, x2, a, d]);
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
        const operation = nodes.filter( (n) => n.nodeType == NodeType.DISPLAY );
        operation.forEach( (op) => {
            let nodes = ComputeOrder(op)
            nodes.forEach( (n) => n.compute() );
        })
    }
    return (
        <div className="nodes">  
            { nodes.map( (d) => d.nodeUI ) }  
        </div>
      );
}

export default Nodes;