import './Node.scss';
import React, { useContext } from 'react';
import Draggable from 'react-draggable';
import { ActionTypes } from '../../state/AppReducers';
import AppState from '../../state/AppState';
import ImageView from './ImageView';

/**
 * Component for node input ports
 */
const NodeInputs = ({inputs}) => <div className="node_input flex-50"> 
    { 
        inputs.map((item, index) => {
            return <div key={index} className="node_io-item layout-row-center flex"> 
                <div className="node_io-point"></div> 
                <div className="node_io-text flex"> {item} </div>
            </div>
    }) 
    }
</div>

/**
 *  Component for node output ports
 */
const NodeOutput = ({outputs}) => <div className="node_output flex-50"> 
    {
        outputs.map((item, index) => {
            return <div key={index} className="node_io-item layout-row-center flex"> 
                <div className="node_io-text flex"> {item} </div>
                <div className="node_io-point"></div> 
            </div>
        }) 
    }
</div>

/**
 * Contains Input and Output ports IU
 */
const NodeIO = ({inputLabels, outputLabels}) => <div className="node_io layout-row flex" > 
    <NodeInputs inputs={inputLabels}></NodeInputs>
    <NodeOutput outputs={outputLabels}></NodeOutput>
</div>

/**
 * Node Title Text
 */
const NodeTitle = ({name}) => <div className="node_title"> {name} </div>

/**
 * Node Property Options
 */
const NodeProps = ({id, type}) => {

  return (
    <div className="node_props"> 
        {
            type === 'DISPLAY' ? <ImageView nodeID={id}></ImageView> : null
        }
    </div>
  )
}

/**
 * Node Component representing a Node in a computation graph
 */
const Node = ({node, onContextMenu}) => {
    const {dispatch} = useContext(AppState.AppContext);
    const nodeRef = React.useRef(null);
    
    const onStart = () => {
        dispatch({ type: ActionTypes.SET_ACTIVE_ELEMENT, activeElement:node });
    }

    const onControlledDrag = (e, position) => {
        e.preventDefault();
        const {x, y} = position;
        node.position.x = x;
        node.position.y = y;
        dispatch({ type: ActionTypes.UPDATE_NODE, node });
      };
    
    const handleClick = () => {
        dispatch({ type: ActionTypes.SET_ACTIVE_ELEMENT, activeElement:node });
    }

    const handleContextMenu = e => { 
        e.preventDefault();
        onContextMenu(e, true, node);
    }

    return (
        <Draggable nodeRef={nodeRef} handle=".node_title" position={node?.position} grid={[5, 5]} onStart={onStart} onDrag={onControlledDrag} >
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