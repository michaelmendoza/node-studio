import React, { useState, useEffect, useContext } from 'react';
import * as d3 from 'd3';
import { GraphContext } from '../contexts/GraphContext';

const Links = () => {
    const { nodes, links, addLink, drawLinks, setDrawLinks } = useContext(GraphContext);
    const handle = () => { setDrawLinks(!drawLinks)};

    useEffect(() => { console.log('Links', links)}, [links])
    useEffect(() => { console.log('Nodes', nodes); CreateLinks(); }, [nodes])

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
        nodes.forEach( (node) => {
            node.outputs.forEach( (output, i) => {
                var j = output.inputs.indexOf(node); 
                let p1 = { x:node.position.x + startOffset.x, y:node.position.y + startOffset.y + i * dyOffset };
                let p2 = { x:output.position.x + endOffset.x, y:output.position.y + endOffset.y + j * dyOffset };
                var link = CreateLink(p1, p2);
                addLink(link);
            })
        })
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

    const RedrawLink = (link, p1, p2) => {
        link.attr("x1", p1.x)
            .attr("y1", p1.y)
            .attr("x2", p2.x)
            .attr("y2", p2.y);
    }

    return (
        <div className="node-links"></div>
    )
}

export default Links;
