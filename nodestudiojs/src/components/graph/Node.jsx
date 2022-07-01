import './Node.scss';
import React, { useContext, useState } from 'react';
import Draggable from 'react-draggable';
import { ActionTypes } from '../../state/AppReducers';
import AppState from '../../state/AppState';
import MouseStates from '../../state/MouseStates';
import NodeProps from './NodeProps';
import NodeIO from './NodeIO';
import { useEffect } from 'react';

/**
 * Node Title Text
 */
const NodeTitle = ({name}) => <div className="node_title"> {name} </div>

/**
 * Node Component representing a Node in a computation graph
 */
const Node = ({node, onContextMenu}) => {
    const {state, dispatch} = useContext(AppState.AppContext);
    const nodeRef = React.useRef(null);
    const [position, setPosition] = useState({ x:node.position.x, y:node.position.y })

    useEffect(() => {
        setPosition({ x:node.position.x, y:node.position.y });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [node.styles]);

    const onStart = () => {
        dispatch({ type: ActionTypes.SET_ACTIVE_ELEMENT, activeElement:node });
        dispatch({ type: ActionTypes.SET_MOUSESTATE, mouseState:MouseStates.DRAG_NODE })
    }

    const onControlledDrag = (e, position) => {
        e.preventDefault();
        const {x, y} = position;
        node.styles.x = Math.floor(x);
        node.styles.y = Math.floor(y);
        setPosition(position)
        dispatch({ type: ActionTypes.UPDATE_NODE, node, updateAPI:false });
      };
    
    const onStop = () => {
        dispatch({ type: ActionTypes.UPDATE_NODE, node: state.nodes[node.id], updateAPI:true });
        dispatch({ type: ActionTypes.SET_MOUSESTATE, mouseState:MouseStates.NORMAL })
    }

    const handleClick = () => {
        dispatch({ type: ActionTypes.SET_ACTIVE_ELEMENT, activeElement:node });
    }

    const handleContextMenu = e => { 
        e.preventDefault();
        onContextMenu(e, true, node);
    }

    const isLarge = node.type === 'DISPLAY' || node.type === 'LINE_DISPLAY' || node.type === 'HISTOGRAM';
    const nodeStyle = isLarge ? { width: '300px'} : {};

    return (
        <Draggable nodeRef={nodeRef} handle=".node_title" position={position} grid={[5, 5]} onStart={onStart} onDrag={onControlledDrag} onStop={onStop}>
            <div ref={nodeRef}>
                <div className='node' style={nodeStyle} onClick={handleClick} onContextMenu={handleContextMenu}>
                    <NodeTitle name={node.name}></NodeTitle>
                    <NodeIO node={node} ></NodeIO>
                    <NodeProps node={node}></NodeProps>
                </div>
            </div>
        </Draggable>
    )
}

export default Node;