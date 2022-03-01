import './LinksSVG.scss';
import React, { useContext } from 'react';
import AppState from '../../state/AppState';

const scale = 0.75;
const startOffset = { x:184 * scale, y:57 * scale }
const endOffset = { x:16 * scale, y:57 * scale}
const dyOffset = 18 * scale;

const LinksSVG = ({handleContextMenu, width = 800, height = 800}) => {
    const {state} = useContext(AppState.AppContext);

    const renderLink = (link) => {
        const startNodeID = link.startNode;
        const startNode = state.nodes[startNodeID];
        const endNodeID = link.endNode;
        const endNode = state.nodes[endNodeID];

        const i = startNode.outputs.indexOf(endNodeID);
        const j = endNode.inputs.indexOf(startNodeID);
        const p1 = { x:startNode.position.x + startOffset.x, y:startNode.position.y + startOffset.y + i * dyOffset };
        const p2 = { x:endNode.position.x + endOffset.x, y:endNode.position.y + endOffset.y + j * dyOffset };

        return (
            <g key={link.id} className={link.id}>
                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} strokeWidth={4} stroke={"#FEFEFE"} strokeLinejoin={"round"} strokeOpacity="0.5"></line>
                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} strokeWidth={1} stroke={"#444444"} strokeLinejoin={"round"}></line>
                <circle cx={p1.x} cy={p1.y} r="3" fill={"#444444"}></circle>
                <circle cx={p2.x} cy={p2.y} r="3" fill={"#444444"}></circle>
            </g>
        )
    }

    return (
        <div className="links-svg">
            <svg height={height} width={width}>
            {
                state.links.map(link => renderLink(link))
            }
            </svg>
        </div>
    )
}

export default LinksSVG;