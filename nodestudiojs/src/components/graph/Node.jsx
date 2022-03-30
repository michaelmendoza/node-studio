import './Node.scss';
import React, { useContext, useState } from 'react';
import Draggable from 'react-draggable';
import { ActionTypes } from '../../state/AppReducers';
import AppState from '../../state/AppState';
import ImageView from './ImageView';
import Select from '../base/Select';
import TextInput from '../base/TextInput';
import { isString } from '../../libraries/utils';
import MouseStates from '../../state/MouseStates';
import MaskGenerator from '../Generators/MaskGenerator';

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
const NodeOutput = ({outputs}) => {
    return (
        <div className="node_output flex-50"> 
            {
                outputs.map((item, index) => {
                    return <div key={index} className="node_io-item layout-row-center flex"> 
                        <div className="node_io-text flex"> {item} </div>
                        <div className="node_io-point"></div> 
                    </div>
                }) 
            }
        </div>
    )
} 

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

const NodePropsOptions = ({id, options, argsDict}) => {
    const {state, dispatch} = useContext(AppState.AppContext);

    const renderTextInput = ({option, index}) =>  {
        const value = argsDict[option];

        const handleTextChange = (e) => {
            const node = { ...state.nodes[id] };
            node.argsDict.filepath = e.target.value;
            dispatch({type: ActionTypes.UPDATE_NODE, node,  updateAPI:true });
        }

        return <TextInput key={index} name={option.replace(/_/g," ")} value={value} onChange={handleTextChange}></TextInput>
    }

    const renderOptionInput = ({option, index}) => {
        const select = option.select.map(x => ({ label:x[0].toUpperCase() + x.substring(1), value:x }))

        const handleOptionChange = (select) => {
            const node = { ...state.nodes[id] };
            node.argsDict[option.name] = select.value;
            dispatch({type: ActionTypes.UPDATE_NODE, node, updateAPI:true });
        }

        return (
            <div key={index}>
                <label>{option.name.replace(/_/g," ")}</label>
                <Select options={select} onChange={handleOptionChange}></Select>
            </div>
        )
    }

    const renderBooleanInput = ({option, index}) => {
        const checked = option.name in argsDict ? argsDict[option.name] : false;

        const handleChange = (e) => {
            const node = { ...state.nodes[id] };
            node.argsDict[option.name] = option.name in argsDict ? !argsDict[option.name] : true;
            dispatch({type: ActionTypes.UPDATE_NODE, node, updateAPI:true });
        }

        return (
            <div key={index} className='layout-row-center layout-space-between'>
                <label>{option.name.replace(/_/g," ")}</label>
                <input type="checkbox" style={{ width:'25px' }} defaultChecked={checked} onClick={handleChange}></input>
            </div>
        )
    }

    return (
        <div>
            {
                options.map((option, index) => {
                    if(isString(option)) {
                        return renderTextInput({option, index});
                    }
                    else if('select' in option) {
                        return renderOptionInput({option, index});
                    }
                    else {
                        return renderBooleanInput({option, index});
                    }
                })
            }
        </div>
    )
}

/**
 * Node Property Options
 */
const NodeProps = ({id, type, options, argsDict}) => {

    return (
    <div className="node_props"> 
        {
            type === 'DISPLAY' || type === 'CDISPLAY' ? <ImageView nodeID={id}></ImageView> : null
        }

        {
            type === 'MASK_GENERATOR' ? <MaskGenerator></MaskGenerator> : null
        }

        {
            <NodePropsOptions id={id} options={options} argsDict={argsDict}></NodePropsOptions>
        }
    </div>
    )
}

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