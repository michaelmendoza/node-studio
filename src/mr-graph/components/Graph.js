import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import NodeCompute, {NodeType} from './NodeCompute';

/** Computation Graph */
const Graph = () => { 
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);

    useEffect(() => {
        CreateGraph();
        RunSession();
    }, [])

    useEffect(() => { console.log('Nodes', nodes); CreateLinks(); }, [nodes])

    useEffect(() => { console.log('Links', links)}, [links])

    const CreateNode = (nodeType, x , y) => {
      return (...inputs) => {
        let node = new NodeCompute({nodeType, x, y, inputs});
        return node;
      }
    }
    
    /** Create a template graph  */
    const CreateGraph = () => {
        var x = CreateNode(NodeType.IMAGE, 100, 100)()
        var x2 = CreateNode(NodeType.IMAGE, 100, 400)()
        var a = CreateNode(NodeType.ADD, 400, 100)(x, x2);
        var d = CreateNode(NodeType.DISPLAY, 700, 100)(a)
        setNodes([...nodes, x, x2, a, d]);
    }
    
    /** Creates an svg with links between nodes in graph */
    const CreateLinks = () => {
        var width = 800;
        var height = 800;
        var svg = d3.select('.node-links').append("svg")
        svg.attr("width", width)
            .attr("height", height)	
        
        var startOffset = { x:185, y:56 }
        var endOffset = { x:16, y:56 }
        var dyOffset = 18;
        
        // Create a link for between each Input and Output connection in the nodes list
        var _links = [];
        nodes.forEach( (node) => {
            node.outputs.forEach( (output, i) => {
                var j = output.inputs.indexOf(node); 
                let p1 = { x:node.position.x + startOffset.x, y:node.position.y + startOffset.y + i * dyOffset };
                let p2 = { x:output.position.x + endOffset.x, y:output.position.y + endOffset.y + j * dyOffset };
                var link = CreateLink(p1, p2);
                _links.push(link);
            })
        })
        setLinks([_links])
    }

    /** Creates a single link  */
    const CreateLink = (p1, p2) => {
        var link = d3.select('.node-links svg').append("line")
        link.attr("x1", p1.x)
            .attr("y1", p1.y)
            .attr("x2", p2.x)
            .attr("y2", p2.y)
            .attr("stroke-width", 2)
            .attr("stroke", "#444444");
        return link;
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
      <div className="node-graph">  
         { nodes.map( (d) => d.nodeUI ) }  
         <div className="node-links"></div>
      </div>
    );
  } 
  
  export default Graph;
