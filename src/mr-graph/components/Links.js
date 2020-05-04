import React, { useEffect, useContext } from 'react';
import * as d3 from 'd3';
import { GraphContext } from '../contexts/GraphContext';

const startOffset = { x:185, y:56 }
const endOffset = { x:16, y:56 }
const dyOffset = 18;

const Links = () => {
    const { nodes, links, addLink, setLinks, updateLinks } = useContext(GraphContext);

    useEffect(() => { DrawLinks(); }, [updateLinks])
    useEffect(() => { console.log('Links', links)}, [links])
    useEffect(() => { console.log('Nodes', nodes); CreateLinks(); }, [nodes])

    /** Creates an svg with links between nodes in graph */
    const CreateLinks = () => {
        var width = 2000;
        var height = 2000;
        var svg = d3.select('.node-links').append("svg")
        svg.attr("width", width)
            .attr("height", height)	
                
        // Create a link for between each Input and Output connection in the nodes list
        nodes.forEach( (startNode) => {
            startNode.outputs.forEach( (endNode, i) => {
                CreateLink(startNode, endNode);
            })
        })
    }

    /** Creates a single link  */
    const CreateLink = (startNode, endNode) => {
        var link = { 
            svg:d3.select('.node-links svg').append("line"),
            startNode:startNode,
            endNode:endNode
        };

        DrawLink(link);
        links.push(link);
        setLinks(links);
    }

    const DrawLink = (link) => {
        var startNode = link.startNode;
        var endNode = link.endNode;
        var i = startNode.outputs.indexOf(endNode);
        var j = endNode.inputs.indexOf(startNode);
        link.p1 = { x:startNode.position.x + startOffset.x, y:startNode.position.y + startOffset.y + i * dyOffset };
        link.p2 = { x:endNode.position.x + endOffset.x, y:endNode.position.y + endOffset.y + j * dyOffset };
        link.svg.attr("x1", link.p1.x)
                .attr("y1", link.p1.y)
                .attr("x2", link.p2.x)
                .attr("y2", link.p2.y)
                .attr("stroke-width", 2)
                .attr("stroke", "#444444");
    }

    const DrawLinks = () => {
        links.forEach((link) => { DrawLink(link); })
    }

    return (
        <div className="node-links"></div>
    )
}

export default Links;
