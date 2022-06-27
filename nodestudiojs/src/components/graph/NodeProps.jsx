import './NodeProps.scss';
import React, { useContext, useEffect, useState } from 'react';
import { ActionTypes } from '../../state/AppReducers';
import AppState from '../../state/AppState';
import ImageView from './NodeViews/ImageView';
import Select from '../base/Select';
import TextInput from '../base/TextInput';
import { isString } from '../../libraries/utils';
import MaskGenerator from '../Generators/MaskGenerator';
import HistogramView from './NodeViews/HistogramView';
import ImageLayerView from './NodeViews/ImageLayerView';
import DataView from './NodeViews/DataView';
import APIDataService from '../../services/APIDataService';
import Node from '../../models/Node';
import DataView1D from './NodeViews/DataView1D';

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
            node.type === 'LAYER_DISPLAY' ? <ImageLayerView node={node} nodeID={node.id}></ImageLayerView> : null
        }

        {
            node.type === 'MASK_GENERATOR' ? <MaskGenerator node={node} nodeID={node.id}></MaskGenerator> : null
        }

        {
            node.type === 'HISTOGRAM' ? <HistogramView node={node} nodeID={node.id}></HistogramView> : null
        }

        {
            <NodePropsOptions node={node} id={node.id} options={node.options} args={node.args}></NodePropsOptions>
        }

        {
            node.type === 'DISPLAY' ? <DisplayComplexPropsOptions node={node}></DisplayComplexPropsOptions> : null 
        }

        {
            node.type === 'DISPLAY' || node.type === 'CDISPLAY' ? <ImageView node={node} nodeID={node.id}></ImageView> : null
        }

        {
            node.type === 'FILE' ? <FilePropsOptions node={node}></FilePropsOptions> : null
        }

        {
            node.type !== 'DISPLAY' ? <DataView node={node} nodeID={node.id}></DataView> : null
        }

        {
            node.type === 'LINE_DISPLAY' ? <DataView1D node={node}></DataView1D> : null
        }
    </div>
    )
}

const FilePropsOptions = ({ node }) => {
    const { state, dispatch } = useContext(AppState.AppContext);
    const [file, setFile] = useState(null)
    const select = state.files.map(file => ({ label:file.name, value:file }));

    useEffect(() => {
        if (node.args.file)
            handleOptionChange({ label:node.args.file.name, value:node.args.file })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleOptionChange = async(select) => {
        node.args['file'] = select.value
        await APIDataService.updateNode(Node.export(node));
        await APIDataService.runSesson([node.id]);
        const metadata = await APIDataService.getNodeViewMetadata(node.id);
        node.view.init(metadata)
        node.view.update += 1;

        setFile(select); 
        dispatch({type: ActionTypes.UPDATE_NODE, node, updateAPI:true });
    }

    return (
        <div>
            {
                state.files.length > 0 ? 
                    <div> 
                        <label>Select File</label> 
                        <Select options={select} value={file} onChange={handleOptionChange}></Select> 
                    </div> : 
                    <div className='text-align-center'> <div> No file available.</div><div> Upload file from files tab. </div> </div> 
            }
        </div>
    )

}

const DisplayComplexPropsOptions = ({ node }) => {
    const { dispatch } = useContext(AppState.AppContext);
    const [datatype, setDatatype] = useState({ label:'Mag', value:'mag'});
    const options = ['mag', 'angle', 'real', 'imag'];
    const select = options.map(x => ({ label:x[0].toUpperCase() + x.substring(1), value:x }));

    const handleOptionChange = async(select) => {
        node.args['complex_datatype'] = select.value
        await APIDataService.updateNode(Node.export(node));
        await APIDataService.runSesson([node.id]);
        node.view.update += 1;
        dispatch({type: ActionTypes.UPDATE_NODE, node, updateAPI:true });
        setDatatype(select);
    }

    return (
        <div>
            {
                node.view.isComplex ? 
                <div> 
                    <label>Complex Datatype</label> 
                    <Select options={select} value={datatype} onChange={handleOptionChange}></Select> 
                </div> : null
            }
        </div>
    )

}

export default NodeProps;