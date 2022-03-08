import './LinksSVG.scss';
import React, { useContext, useState } from 'react';
import AppState from '../../state/AppState';
import { ActionTypes } from '../../state/AppReducers';
import MouseStates from '../../state/MouseStates';
import Link from '../../models/Link';

const scale = 0.75;
const startOffset = { x:184 * scale, y:57 * scale }
const endOffset = { x:16 * scale, y:57 * scale}
const dyOffset = 18 * scale;

const LinksSVG = ({position, onContextMenu, width = 800, height = 800}) => {
    const {state, dispatch} = useContext(AppState.AppContext);
    const [port, setPort] = useState({ node: null, type:'output', index:0 });

    const renderLink = (link) => {
        const startNodeID = link.startNode;
        const startNode = state.nodes[startNodeID];
        const endNodeID = link.endNode;
        const endNode = state.nodes[endNodeID];

        const i = startNode.outputs.indexOf(endNodeID);
        const j = endNode.inputs.indexOf(startNodeID);
        const p1 = { x:startNode.position.x + startOffset.x, y:startNode.position.y + startOffset.y + i * dyOffset };
        const p2 = { x:endNode.position.x + endOffset.x, y:endNode.position.y + endOffset.y + j * dyOffset };

        const handleClick = () => {
            dispatch({ type: ActionTypes.SET_ACTIVE_ELEMENT, activeElement:link });
        }

        const handleContextMenu = e => { 
            e.preventDefault();
            onContextMenu(e, true, link);
        }

        return (
            <g key={link.id} className={'link-' + link.id} onClick={handleClick} onContextMenu={handleContextMenu}>
                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} strokeWidth={4} stroke={"#FEFEFE"} strokeLinejoin={"round"} strokeOpacity="0.5"></line>
                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} strokeWidth={1} stroke={"#444444"} strokeLinejoin={"round"}></line>
                <circle cx={p1.x} cy={p1.y} r="3" fill={"#444444"}></circle>
                <circle cx={p2.x} cy={p2.y} r="3" fill={"#444444"}></circle>
            </g>
        )
    }

    const renderPorts = (node) => {

        const outputPorts = node.outputLabels.map((x, i) => ({ x: node.position.x + startOffset.x, y: node.position.y + startOffset.y + i * dyOffset, node }));
        const inputPorts = node.inputLabels.map((x, i) => ({ x: node.position.x + endOffset.x, y: node.position.y + endOffset.y + i * dyOffset, node }));

        const handleMouseDown = (e, type, index) => {
            setPort({ node, type, index });
            dispatch({ type: ActionTypes.SET_MOUSESTATE, mouseState:MouseStates.CREATE_LINK })
        }

        const handleMouseUp = (e, endNode, type, index) => {
            console.log(type, index);

            if(port.type === 'output') {
                const link = new Link({ startNode:port.node.id, endNode:endNode.id });
                dispatch({ type: ActionTypes.ADD_LINK, link });
            }
        }

        return (
            <g key={node.id} className={'node-' + node.id}>
                { 
                    outputPorts.map((p, i) => <circle key={i} className='output-port' cx={p.x} cy={p.y} r="5" fill={"#FEFEFE"} stroke={"#444444"} onMouseDown={(e) => handleMouseDown(e, 'output', i)} onMouseUp={(e) => handleMouseUp(e, p.node, 'output', i)}></circle> )
                }
                {
                    inputPorts.map((p, i) => <circle key={i} className='input-port' cx={p.x} cy={p.y} r="5" fill={"#FEFEFE"} stroke={"#444444"} onMouseDown={(e) => handleMouseDown(e, 'input', i)} onMouseUp={(e) => handleMouseUp(e, p.node, 'input', i)}></circle> )
                }
            </g>
        )
    }

    const renderNewLine = () => {
        const p1 = port.type === 'output' ? { x: port.node.position.x + startOffset.x, y: port.node.position.y + startOffset.y + port.index * dyOffset } :
                                            { x: port.node.position.x + endOffset.x, y: port.node.position.y + endOffset.y + port.index * dyOffset }
        const p2 = { x: position.x, y: position.y }

        return (
            <g className='render-new-line'>
                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} strokeWidth={3} stroke={"#FEFEFE"} strokeLinejoin={"round"} strokeOpacity="0.5"></line>
                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} strokeWidth={2} stroke={"#444444"} strokeLinejoin={"round"} strokeOpacity="0.9"></line>
                <circle cx={p1.x} cy={p1.y} r="3" fill={"#444444"}></circle>
            </g>
        )
    }

    return (
        <div className="links-svg">
            <svg height={height} width={width}>
            {
                Object.values(state.nodes).map(node => renderPorts(node))
            }
            {
                state.links.map(link => renderLink(link))
            }
            {
                state.mouseState === MouseStates.CREATE_LINK ? renderNewLine() : null
            }
            </svg>
        </div>
    )
}

export default LinksSVG;