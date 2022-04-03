import './Node.scss';
import React, { useContext, useState } from 'react';
import Draggable from 'react-draggable';
import { ActionTypes } from '../../state/AppReducers';
import AppState from '../../state/AppState';
import MouseStates from '../../state/MouseStates';
import NodeProps from './NodeProps';
import NodeIO from './NodeIO';

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

    const onStart = () => {
        dispatch({ type: ActionTypes.SET_ACTIVE_ELEMENT, activeElement:node });
        dispatch({ type: ActionTypes.SET_MOUSESTATE, mouseState:MouseStates.DRAG_NODE })
    }

    const onControlledDrag = (e, position) => {
        e.preventDefault();
        const {x, y} = position;
        node.position.x = Math.round(x);
        node.position.y = Math.round(y);
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

    return (
        <Draggable nodeRef={nodeRef} handle=".node_title" position={position} grid={[5, 5]} onStart={onStart} onDrag={onControlledDrag} onStop={onStop}>
            <div ref={nodeRef}>
                <div className='node' onClick={handleClick} onContextMenu={handleContextMenu}>
                    <NodeTitle {...node}></NodeTitle>
                    <NodeIO {...node} ></NodeIO>
                    <NodeProps {...node}></NodeProps>
                </div>
            </div>
        </Draggable>
    )
}

export default Node;