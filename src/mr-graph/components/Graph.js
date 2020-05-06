import React, { useState, useEffect, useContext } from 'react';
import { GraphContext } from '../contexts/GraphContext';
import Links from './Links';
import Nodes, { CreateNode } from './Nodes';
import NodeCompute, {NodeType} from './NodeCompute';
import ContextMenu from './ContextMenu';

/** Computation Graph */
const Graph = () => { 
  const { createNodeType, addNode, setNodes } = useContext(GraphContext);

  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState( {x:0, y:0});

  useEffect(() => { CreateGraph(); }, [])
  
  /** Create a template graph  */
  const CreateGraph = () => {
      var x = CreateNode(NodeType.IMAGE, 100, 100)()
      var x2 = CreateNode(NodeType.IMAGE, 100, 450)()
      var a = CreateNode(NodeType.ADD, 400, 100)(x, x2);
      var d = CreateNode(NodeType.DISPLAY, 700, 100)(a)
      setNodes([x, x2, a, d]);
  }

  const handleClick = e => {
    setVisible(false);
  }
  
  const handleContextMenu = e => {
    event.preventDefault();
    setVisible(!visible);
    setPosition({x:e.pageX - 60, y:e.pageY - 60})
  }

  const handleDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    console.log(createNodeType);
    var node = CreateNode(createNodeType, e.pageX - 60, e.pageY - 60)()
    addNode(node);
  };

  return (
    <div className="node-graph blueprint-dots" 
          onClick={handleClick}
          onContextMenu={handleContextMenu}
          onDrop={e => handleDrop(e)}
          onDragOver={e => handleDragOver(e)}>  
          <ContextMenu visible={visible} position={position}></ContextMenu>
          <Nodes></Nodes> 
          <Links></Links>
    </div>
  );
} 
  
export default Graph;
