import React, { useState, useEffect, useContext } from 'react';
import { GraphContext } from '../contexts/GraphContext';
import Links from './Links';
import Nodes, { CreateNode } from './Nodes';
import NodeCompute, {NodeType} from './NodeCompute';
import ContextMenu from './ContextMenu';

/** Computation Graph */
const Graph = () => { 
  const { createNodeType, addNode, setNodes } = useContext(GraphContext);

  // State variables for context menu 
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState( {x:0, y:0});
  const [activeNode, setActiveNode] = useState(null); 
  const [activeLink, setActiveLink] = useState(null);

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
  
  const handleContextMenu = (e, data) => { 
    event.preventDefault();
    setVisible(!visible);
    setPosition({x:e.pageX, y:e.pageY});
    if(data) {
      if(data.node !== null) {
        setActiveNode(data.node);
        setActiveLink(null);
      }
      if(data.link !== null) {
        setActiveLink(data.link);
        setActiveNode(null);
      }
    }
    else {
      setActiveNode(null);
      setActiveLink(null);
    }
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
    <div className="node-graph" 
        onClick={handleClick}
        onDrop={e => handleDrop(e)}
        onDragOver={e => handleDragOver(e)}>  
      <div className="graph-background blueprint-dots" onContextMenu={handleContextMenu}></div> 
      <ContextMenu visible={visible} position={position} node={activeNode} link={activeLink}></ContextMenu>
      <Nodes handleContextMenu={handleContextMenu}></Nodes> 
      <Links handleContextMenu={handleContextMenu}></Links>
    </div>
  );
} 
  
export default Graph;
