import './NodeProps.scss';
import React, { useContext, useEffect } from 'react';
import { ActionTypes } from '../../state/AppReducers';
import AppState from '../../state/AppState';
import ImageView from './ImageView';
import Select from '../base/Select';
import TextInput from '../base/TextInput';
import { isString } from '../../libraries/utils';
import MaskGenerator from '../Generators/MaskGenerator';
import HistogramView from './HistogramView';

/**
 * Node Property Options
 */
const NodePropsOptions = ({id, options, args}) => {
    const {state, dispatch} = useContext(AppState.AppContext);

    useEffect(() => {
        // Set default values for BooleanInput
        options.forEach((option, index) => {
            const hasFlag = option.flag;
            if(hasFlag) {
                const checked = option.name in args ? args[option.name] : option.flag;
                const node = state.nodes[id].copy();
                node.args[option.name] = checked;
                dispatch({type: ActionTypes.UPDATE_NODE, node, updateAPI:true });
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const renderTextInput = ({option, index}) =>  {
        const value = args[option];

        const handleTextChange = (e) => {
            const node = state.nodes[id].copy();
            node.args[option] = e.target.value;
            dispatch({type: ActionTypes.UPDATE_NODE, node,  updateAPI:true });
        }

        return <TextInput key={index} name={option.replace(/_/g," ")} value={value} onChange={handleTextChange}></TextInput>
    }

    const renderOptionInput = ({option, index}) => {
        const v = args[option.name];
        const value = v ? { label:v[0].toUpperCase() + v.substring(1), value:v } : undefined;
        const select = option.select.map(x => ({ label:x[0].toUpperCase() + x.substring(1), value:x }));

        const handleOptionChange = (select) => {
            const node = state.nodes[id].copy();
            node.args[option.name] = select.value;
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
        const checked = option.name in args ? args[option.name] : defaultValue;

        const handleChange = (e) => {
            const node = state.nodes[id].copy();
            node.args[option.name] = option.name in args ? !args[option.name] : true;
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
const NodeProps = ({node}) => {

    return (
    <div className="node_props"> 
        {
            node.type === 'DISPLAY' || node.type === 'CDISPLAY' ? <ImageView nodeID={node.id}></ImageView> : null
        }

        {
            node.type === 'MASK_GENERATOR' ? <MaskGenerator nodeID={node.id}></MaskGenerator> : null
        }

        {
            node.type === 'HISTOGRAM' ? <HistogramView nodeID={node.id}></HistogramView> : null
        }

        {
            <NodePropsOptions id={node.id} options={node.options} args={node.args}></NodePropsOptions>
        }
    </div>
    )
}

export default NodeProps;