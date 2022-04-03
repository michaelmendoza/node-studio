import './NodeProps.scss';
import React, { useContext, useEffect } from 'react';
import { ActionTypes } from '../../state/AppReducers';
import AppState from '../../state/AppState';
import ImageView from './ImageView';
import Select from '../base/Select';
import TextInput from '../base/TextInput';
import { isString } from '../../libraries/utils';

/**
 * Node Property Options
 */
const NodePropsOptions = ({id, options, argsDict}) => {
    const {state, dispatch} = useContext(AppState.AppContext);

    useEffect(() => {
        // Set default values for BooleanInput
        options.forEach((option, index) => {
            const hasFlag = option.flag;
            if(hasFlag) {
                const checked = option.name in argsDict ? argsDict[option.name] : option.flag;
                const node = { ...state.nodes[id] };
                node.argsDict[option.name] = checked;
                dispatch({type: ActionTypes.UPDATE_NODE, node, updateAPI:true });
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const renderTextInput = ({option, index}) =>  {
        const value = argsDict[option];

        const handleTextChange = (e) => {
            const node = { ...state.nodes[id] };
            node.argsDict[option] = e.target.value;
            dispatch({type: ActionTypes.UPDATE_NODE, node,  updateAPI:true });
        }

        return <TextInput key={index} name={option.replace(/_/g," ")} value={value} onChange={handleTextChange}></TextInput>
    }

    const renderOptionInput = ({option, index}) => {
        const v = argsDict[option.name];
        const value = v ? { label:v[0].toUpperCase() + v.substring(1), value:v } : undefined;
        const select = option.select.map(x => ({ label:x[0].toUpperCase() + x.substring(1), value:x }));

        const handleOptionChange = (select) => {
            const node = { ...state.nodes[id] };
            node.argsDict[option.name] = select.value;
            dispatch({type: ActionTypes.UPDATE_NODE, node, updateAPI:true });
        }

        return (
            <div key={index}>
                <label>{option.name.replace(/_/g," ")}</label>
                <Select options={select} value={value} onChange={handleOptionChange}></Select>
            </div>
        )
    }

    const renderBooleanInput = ({option, index}) => {
        const defaultValue = option.flag;
        const checked = option.name in argsDict ? argsDict[option.name] : defaultValue;

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
            <NodePropsOptions id={id} options={options} argsDict={argsDict}></NodePropsOptions>
        }
    </div>
    )
}

export default NodeProps;