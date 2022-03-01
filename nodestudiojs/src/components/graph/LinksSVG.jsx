import React, { useEffect, useContext } from 'react';
import AppState from '../../state/AppState';
import * as d3 from 'd3';

const startOffset = { x:185, y:56 }
const endOffset = { x:16, y:56 }
const dyOffset = 18;

const LinksSVG = ({handleContextMenu}) => {
    const {state, dispatch} = useContext(AppState.AppContext);

    const createSVG = ({width = 800, height = 800}) => {
        if (d3.select('.node-links svg')[0] == null) {
            var svg = d3.select('.node-links').append("svg")
            svg.attr("width", width).attr("height", height)	
        }

        state.links.forEach(link => createLinkSVG(link));
    }

    const createLinkSVG = (link) => {
        const linkSVG = {
            link: link,
            svg: d3.select('.node-links svg').append("line"),
            clickArea: d3.select('.node-links svg').append("line")
        }

        link.svg.on('click', (e) => {
            console.log('Link Click');
        })

        drawLink(link);
    }

    const drawLink = (link) => {
        const startNodeID = link.startNode;
        const startNode = state.nodes[startNodeID];
        const endNodeID = link.endNode;
        const endNode = state.nodes[endNodeID];

        var i = startNode.outputs.indexOf(endNodeID);
        var j = endNode.inputs.indexOf(startNodeID);
        link.p1 = { x:startNode.position.x + startOffset.x, y:startNode.position.y + startOffset.y + i * dyOffset };
        link.p2 = { x:endNode.position.x + endOffset.x, y:endNode.position.y + endOffset.y + j * dyOffset };
        link.svg.attr("x1", link.p1.x)
                .attr("y1", link.p1.y)
                .attr("x2", link.p2.x)
                .attr("y2", link.p2.y)
                .attr("stroke-width", 5)
                .attr("stroke", "#444444");
    }

    const drawLinks = () => {
        state.links.forEach(link => drawLink(link));
    }

    return (
        <div className="links-hook"></div>
    )
}

export default LinksSVG;