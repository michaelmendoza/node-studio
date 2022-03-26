import './LinksSVG.scss';
import React, { useContext, useState } from 'react';
import AppState from '../../state/AppState';
import { ActionTypes } from '../../state/AppReducers';
import MouseStates from '../../state/MouseStates';
import LinkModel from '../../models/Link';

const scale = 0.75;
const startOffset = { x:184 * scale, y:57 * scale }
const endOffset = { x:16 * scale, y:57 * scale}
const dyOffset = 34 * scale;

const Port = ({port, index, type, handleMouseDown, handleMouseUp}) => {

    const [radius, setRadius] = useState(5);
    const [fill, setFill] = useState("#FEFEFE");
    const [stroke, setStroke] = useState("#444444");

    const handleMouseEnter = () => { setRadius(6); setStroke("#000000"); }

    const handleMouseLeave = () => { setRadius(5); setStroke("#444444"); }

    return (
        <g className='port' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} 
                            onMouseDown={(e) => handleMouseDown(e, type, index)} onMouseUp={(e) => handleMouseUp(e, port.node, type, index)}>
            <circle className='port-circle' cx={port.x} cy={port.y} r={radius} fill={fill} stroke={stroke}></circle> 
            <rect className='port-clickbox' x={port.x - 14} y={port.y - 13} width="26" height="26" opacity="0%"></rect> 
        </g>
    )
}

const Link = ({link, onContextMenu}) => {
    const {state, dispatch} = useContext(AppState.AppContext);

    const [line, setLine] = useState({ stroke0:"#222222", stroke1:"#FEFEFE", opacity0:"0.4", opacity1:"1.0" });

    const startNodeID = link.startNode;
    const startNode = state.nodes[startNodeID];
    const endNodeID = link.endNode;
    const endNode = state.nodes[endNodeID];

    if (startNode === undefined || endNode === undefined) return null

    const p1 = { x:startNode.position.x + startOffset.x, y:startNode.position.y + startOffset.y + link.startPort * dyOffset };
    const p2 = { x:endNode.position.x + endOffset.x, y:endNode.position.y + endOffset.y + link.endPort * dyOffset };

    const handleClick = () => {
        dispatch({ type: ActionTypes.SET_ACTIVE_ELEMENT, activeElement:link });
    }

    const handleMouseEnter = () => { setLine({...line, opacity0:"0.8", stroke0:"#222222", stroke1:"#EEEEEE", opacity1:"0.8"}); }

    const handleMouseLeave = () => { setLine({...line, opacity0:"0.4", stroke0:"#222222", stroke1:"#FEFEFE", opacity1:"1.0"}); }

    const handleContextMenu = e => { 
        e.preventDefault();
        onContextMenu(e, true, link);
    }

    return (
        <g key={link.id} className={'link-' + link.id} onClick={handleClick} onContextMenu={handleContextMenu} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} strokeWidth={4} stroke={line.stroke0} strokeLinejoin={"round"} strokeOpacity={line.opacity0}></line>
            <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} strokeWidth={2} stroke={line.stroke1} strokeLinejoin={"round"} strokeOpacity={line.opacity1}></line>
            <circle cx={p1.x} cy={p1.y} r="3" fill={"#444444"}></circle>
            <circle cx={p2.x} cy={p2.y} r="3" fill={"#444444"}></circle>
        </g>
    )
}

const LinksSVG = ({position, onContextMenu, width = 1600, height = 1600}) => {
    const {state, dispatch} = useContext(AppState.AppContext);
    const [activePort, setActivePort] = useState({ node: null, type:'output', index:0 });

    const renderPorts = (node) => {

        const outputPorts = node?.outputLabels.map((x, i) => ({ x: node.position.x + startOffset.x, y: node.position.y + startOffset.y + i * dyOffset, node }));
        const inputPorts = node?.inputLabels.map((x, i) => ({ x: node.position.x + endOffset.x, y: node.position.y + endOffset.y + i * dyOffset, node }));

        const handleMouseDown = (e, type, index) => {
            setActivePort({ node, type, index });
            dispatch({ type: ActionTypes.SET_MOUSESTATE, mouseState:MouseStates.CREATE_LINK })
        }

        const handleMouseUp = (e, endNode, type, index) => {
            console.log(type, index);

            if(activePort.type === 'output') {
                const link = new LinkModel({ startNode:activePort.node.id, startPort:activePort.index, endNode:endNode.id, endPort:index });
                dispatch({ type: ActionTypes.ADD_LINK, link, updateAPI: true });
            }
        }

        return (
            <g key={node.id} className={'node-' + node.id}>
                { 
                    outputPorts?.map((p, i) => <Port key={i} port={p} index={i} type={'output'} handleMouseDown={handleMouseDown} handleMouseUp={handleMouseUp}></Port> )
                }
                {
                    inputPorts?.map((p, i) => <Port key={i} port={p} index={i} type={'input'} handleMouseDown={handleMouseDown} handleMouseUp={handleMouseUp}></Port>)
                }
            </g>
        )
    }

    const renderNewLine = () => {
        const p1 = activePort.type === 'output' ? { x: activePort.node.position.x + startOffset.x, y: activePort.node.position.y + startOffset.y + activePort.index * dyOffset } :
                                            { x: activePort.node.position.x + endOffset.x, y: activePort.node.position.y + endOffset.y + activePort.index * dyOffset }
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
                Object.values(state.nodes).map(node => node ? renderPorts(node) : null)
            }
            {
                state.links.map(link => <Link link={link} onContextMenu={onContextMenu}></Link>)
            }
            {
                state.mouseState === MouseStates.CREATE_LINK ? renderNewLine() : null
            }
            </svg>
        </div>
    )
}

export default LinksSVG;