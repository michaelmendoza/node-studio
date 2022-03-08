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

const FileProps = ({nodeID}) => {
    const {state, dispatch} = useContext(AppState.AppContext);
    const [filetype, setFiletype] = useState();
    const [filepath, setFilepath] = useState(state.nodes[nodeID]?.argsDict?.filepath);

    const handleFilepathChange = (e) => {
        setFilepath(e.target.value);

        const node = { ...state.nodes[nodeID] };
        node.argsDict.filepath = e.target.value;
        dispatch({type: ActionTypes.UPDATE_NODE, node,  updateAPI:true });
    }

    const handleOptionUpdate = (option) => {
        setFiletype(option);
        
        const node = { ...state.nodes[nodeID] };
        node.argsDict.filetype = option.value;
        dispatch({type: ActionTypes.UPDATE_NODE, node,  updateAPI:true });
    }

    const options = [{label:'Dicom (.dcm)', value:'dcm'}, {label:'Raw Data (.dat)', value:'dat'}]

    return (
        <div>
            <Select options={options} placeholder={'Select FileType'} onChange={handleOptionUpdate}></Select>
            <TextInput name='filepath' placeholder='Enter filepath' value={filepath} onChange={handleFilepathChange}></TextInput>
        </div>
    )
}

/**
 * Node Property Options
 */
const NodeProps = ({id, type, options, argsDict}) => {
    const {state, dispatch} = useContext(AppState.AppContext);

    return (
    <div className="node_props"> 
        {
            type === 'FILE' ? <FileProps nodeID={id}></FileProps> : null
        }

        {
            type === 'DISPLAY' ? <ImageView nodeID={id}></ImageView> : null
        }

        {
            !(type === 'FILE' || type === 'DISPLAY') ? <div>
                {
                    options.map((option, index) => {
                        if(isString(option)) {
                            return <TextInput key={index} name={option}></TextInput>
                        }
                        else {
                            const select = option.select.map(x => ({ label:x[0].toUpperCase() + x.substring(1), value:x }))
                            const handleOptionChange = (select) => {
                                const node = { ...state.nodes[id] };
                                node.argsDict[option.name] = select.value;
                                dispatch({type: ActionTypes.UPDATE_NODE, node, updateAPI:true });
                            }
                            return <Select key={index} options={select} onChange={handleOptionChange}></Select>
                        }
                    })
                }
            </div> : null
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
        node.position.x = x;
        node.position.y = y;
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