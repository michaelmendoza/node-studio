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
import Modal from '../base/Modal';

/**
 * Node Property Options
 */
export const NodePropsOptions = ({node}) => {
    const id = node.id;
    const options = node.options;

    return (
        <div>
            {
                options.map((option, index) => { 
                    return <NodePropsOption key={index} id={id} option={option}></NodePropsOption>
                })
            }
        </div>
    )
}

/**
 * Node Property Option
 */
export const NodePropsOption = ({id, option}) => {
    const {state, dispatch} = useContext(AppState.AppContext);
    const args = state.nodes[id].args;

    const renderTextInput = ({option}) =>  {
        const value = args[option];

        const handleTextChange = (e) => {
            const node = state.nodes[id].copy();
            node.args[option] = e.target.value;
            dispatch({type: ActionTypes.UPDATE_NODE, node, updateAPI:true });
        }

        return <TextInput name={option.replace(/_/g," ")} value={value} onChange={handleTextChange}></TextInput>
    }

    const renderOptionInput = ({option}) => {
        const v = args[option.name];
        const value = v ? { label:v[0].toUpperCase() + v.substring(1), value:v } : undefined;
        const select = option.select.map(x => ({ label:x[0].toUpperCase() + x.substring(1), value:x }));

        const handleOptionChange = (select) => {
            const node = state.nodes[id].copy();
            node.args[option.name] = select.value;
            dispatch({type: ActionTypes.UPDATE_NODE, node, updateAPI:true });
        }

        return (
            <div>
                <label>{option.name.replace(/_/g," ")}</label>
                <Select options={select} value={value} onChange={handleOptionChange}></Select>
            </div>
        )
    }

    const renderBooleanInput = ({option}) => {
        const defaultValue = option.flag;
        const checked = option.name in args ? args[option.name] : defaultValue;

        const handleChange = (e) => {
            const node = state.nodes[id].copy();
            node.args[option.name] = option.name in args ? !args[option.name] : true;
            dispatch({type: ActionTypes.UPDATE_NODE, node, updateAPI:true });
        }

        return (
            <div className='layout-row-center layout-space-between'>
                <label>{option.name.replace(/_/g," ")}</label>
                <input type="checkbox" style={{ width:'25px' }} defaultChecked={checked} onClick={handleChange}></input>
            </div>
        )
    }

    return (
        <div>
            {
                isString(option) ? renderTextInput({option}) : 
                    ('select' in option ? renderOptionInput({option}) : renderBooleanInput({option}))
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
            <NodePropsOptions node={node}></NodePropsOptions>
        }

        {
            node.type === 'DISPLAY' ? <DisplayComplexPropsOptions node={node}></DisplayComplexPropsOptions> : null 
        }

        {
            node.type === 'DISPLAY' ? <ImageView node={node} nodeID={node.id}></ImageView> : null
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
    const [file, setFile] = useState(null);
    const [files, setFiles] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchImageData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.files])

    const fetchImageData = async () => {
        const _files = [...state.files];
        const ids = state.files.map(file => file.id);
        for(var i = 0; i < _files.length; i++) {
            _files[i].img = await APIDataService.getFilePreview(ids[i]);
        }
        setFiles(_files);
    }

    const handleFileChange = async(_file) => {
        node.args['file'] = _file; //select.value
        await APIDataService.updateNode(Node.export(node));
        await APIDataService.runSesson([node.id]);
        const metadata = await APIDataService.getNodeViewMetadata(node.id);
        node.view.init(metadata)
        node.view.update += 1;

        setFile(_file); 
        dispatch({type: ActionTypes.UPDATE_NODE, node, updateAPI:true });
        setShowModal(false);
    }

    return (
        <div className='file-props-options'>
            {
                state.files.length > 0 ? 
                    <div> 
                        <label>Select File</label> 
                        <button className='button-dark' onClick={() => setShowModal(true)}> { file ? file.name : 'Select File'} </button>
                    </div> : 
                    <div className='text-align-center'> <div> No file available.</div><div> Upload file from files tab. </div> </div> 
            }

            <Modal className='file-props-options-modal' title='Available Files' open={showModal} onClose={() => setShowModal(!showModal)}>
                <div>
                    <h2> Select a File: </h2>
                    {
                        files.map((file) => <div key={file.id} className='layout-row file-item' onClick={() => handleFileChange(file)}> 
                            <img src={file.img} alt={'File Preview'}/> 
                            <div >
                                <label> Name: {file.name} </label>
                                <label> Type: {file.type} </label>
                                <label> Path: {file.path} </label>
                            </div>
                            </div> )
                    }
                </div>
            </Modal>
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