import React, { useEffect, useContext } from 'react';
import { GraphContext } from '../contexts/GraphContext';
import Links from './Links';
import Nodes, { CreateNode } from './Nodes';
import NodeCompute, {NodeType} from './NodeCompute';

/** Computation Graph */
const Graph = () => { 
  const { addNode, setNodes } = useContext(GraphContext);
  useEffect(() => { CreateGraph(); }, [])
  
  /** Create a template graph  */
  const CreateGraph = () => {
      var x = CreateNode(NodeType.IMAGE, 100, 100)()
      var x2 = CreateNode(NodeType.IMAGE, 100, 450)()
      var a = CreateNode(NodeType.ADD, 400, 100)(x, x2);
      var d = CreateNode(NodeType.DISPLAY, 700, 100)(a)
      setNodes([x, x2, a, d]);
  }
  
  const handleDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    var node = CreateNode(NodeType.IMAGE, e.pageX - 60, e.pageY - 60)()
    addNode(node);
  };

  return (
    <div className="node-graph blueprint-dots" onDrop={e => handleDrop(e)}
                                               onDragOver={e => handleDragOver(e)}>  
          <Nodes></Nodes> 
          <Links></Links>
    </div>
  );
} 
  
export default Graph;
