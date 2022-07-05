import './NodeInspector.scss';
import { useContext } from 'react';
import AppState from '../../state/AppState';
import Divider from '../base/Divider';
import { ActionTypes } from '../../state';
import { useState } from 'react';
import { useEffect } from 'react';
import { isNumber } from '../../libraries/utils';
import Slider from '../base/Slider';
import Select from '../base/Select';
import { NodePropsOptions } from '../graph/NodeProps';
import NodeList from '../../models/NodeList';

const NodeInspectorPosition = () => {
    const { state, dispatch } = useContext(AppState.AppContext);
    const [position, setPosition] = useState({ x:state.activeElement.styles.x, y: state.activeElement.styles.y })

    useEffect(() => {
        const id = state.activeElement.id;
        const node = state.nodes[id];
        if(!node) return;
        setPosition({ x: node.styles.x, y: node.styles.y });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.activeElement.styles]);

    const handleChangeX = (e) => {
        if (!isNumber(e.target.value)) return;
        const value = Math.floor(e.target.value);
        setPosition({ x: value, y: position.y });
    }

    const handleChangeY = (e) => {
        if (!isNumber(e.target.value)) return;
        const value = Math.floor(e.target.value);
        setPosition({ x: position.x, y: value });
    }

    const handleUpdateX = () => {
        const node = state.activeElement.copy();
        node.styles = { ...node.styles, x: position.x };
        dispatch({type: ActionTypes.UPDATE_NODE, node, updateAPI:true });
    }

    const handleUpdateY = () => {
        const node = state.activeElement.copy();
        node.styles = { ...node.styles, y: position.y };
        dispatch({type: ActionTypes.UPDATE_NODE, node, updateAPI:true });
    }

    return (<div className='node-inspector-position'>
        <label>Position</label>
        <div className='layout-row'>
            <div className='text-input'> <label> X </label> <input type='text' name='x' value={position.x} onChange={handleChangeX} onKeyDown={(e) => {if(e.key === 'Enter') handleUpdateX()}} onBlur={handleUpdateX}></input></div>
            <div className='text-input'> <label> Y </label> <input type='text' name='y' value={position.y} onChange={handleChangeY} onKeyDown={(e) => {if(e.key === 'Enter') handleUpdateY()}} onBlur={handleUpdateY}></input></div>
        </div>
    </div>)
}

const NodeInspectorView = () => {
    const { state, dispatch } = useContext(AppState.AppContext);
    const [contrastLevel, setContrastLevel] = useState(0);
    const [contrastWindow, setContrastWindow] = useState(0);
    const [colormap, setColormap] = useState({ label:'B/W', value:'bw'});
    const colormapOptions = [{ label:'B/W', value:'bw'}, { label:'Jet', value:'jet'}];
    const id = state.activeElement.id;
    const node = state.nodes[id];
    const view = node.view;
    
    useEffect(() => {
        if (node.view.hasData) {
            setContrastLevel(node.view.contrast.level);
            setContrastWindow(node.view.contrast.window);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleContrastLevelUpdate = (value) => {
        setContrastLevel(value);
        node.view.contrast.useContrast = true;
        node.view.contrast.level = value;
    }

    const handleContrastWindowUpdate = (value) => {
        setContrastWindow(value);
        node.view.contrast.useContrast = true;
        node.view.contrast.window = value;
    }

    const handleNodeUpdate = () => {
        node.view.update++;
        dispatch({type: ActionTypes.UPDATE_NODE, node, updateAPI:false });
    }

    const handleColormapChange = (select) => {
        setColormap(select);
        node.view.colormap = select.value;
        //const _node = node.copy();
        //dispatch({type: ActionTypes.UPDATE_NODE, node:_node, updateAPI:true });
    }

    return (<div className='node-inspector-view'>
        <div>
            <div className='node-property-item'>
                <label>Shape</label>
                <span> { JSON.stringify(view.shape) } </span>
            </div>

            <div className='node-property-item'>
                <label>Indices</label>
                <div> { JSON.stringify(view.indices) } </div>
            </div>

            <div className='node-property-item'>
                <label>isComplex</label>
                <div> { view.isComplex ? 'Yes': 'No' } </div>
            </div>

            <div className='node-property-item'>
                <label>Color Map</label>
                <div> <Select options={colormapOptions} value={colormap} onChange={handleColormapChange}></Select> </div>
            </div>
 
            <div className='node-property-item'>
                <label>UseContrast</label>
                <div> { view.contrast.useContrast ? 'Yes': 'No'} </div>
            </div>

            <div className='node-property-item'>
                <label>Resolution</label>
                <div> { view.contrast.resolution } </div>
            </div>

            <div className='node-property-item slider'>
                <Slider label={'Level'} value={contrastLevel} onChange={handleContrastLevelUpdate} onMouseUp={handleNodeUpdate} max={4096} min={0}></Slider>
            </div>

            <div className='node-property-item slider'>
                <Slider label={'Window'} value={contrastWindow} onChange={handleContrastWindowUpdate} onMouseUp={handleNodeUpdate} max={4096} min={0}></Slider> 
            </div>
        </div>
    </div>)
}

const NodeInspector = () => {
    const {state} = useContext(AppState.AppContext);
    const id = state.activeElement?.id;
    const node = state?.nodes[id];
    const info = NodeList.getNode(node?.props?.type);

    const NodeProps = ({node}) => <div style={{width:'100%'}}>
        <h1 style={{ margin:'0 0 0.5em 0' }}> {node?.props?.name } </h1>
        <div> { info?.description } </div>
        <Divider></Divider>

        <label>Description</label>
        <div> { info?.detail } </div>
        <Divider></Divider>

        <NodeInspectorPosition></NodeInspectorPosition>
        <Divider></Divider>

        <label>Properties</label>
        {
            node.options?.length > 0 ? <NodePropsOptions node={node}></NodePropsOptions> : 'No Properties to Modify'
        }
        <Divider></Divider>

        <label>Data View</label>
        { 
            node.view?.hasData ? <NodeInspectorView></NodeInspectorView> : "Run node in session to load data view"
        }
        <Divider></Divider>

    </div>

    const Props = ({node}) => {
        return (<div>
            { node ? <NodeProps node = {node}></NodeProps> : null }
        </div>)
    }

    return (
        <div className='node-inspector'> 
            {
                state.activeElement ? <Props node={node}></Props> : null
            }
        </div>
    );
}

const DebugInspector = () => {
    const {state} = useContext(AppState.AppContext);

    return (<div>
        {
                    state.activeElement ? Object.keys(state.activeElement).map( (key) => {
                        return (<div key={key}>
                            <label>{key}</label>
                            <div>{JSON.stringify(state.activeElement[key], null,'\t')}</div>
                        </div>) 
                    }) : null
                }
    </div>)
}

export default NodeInspector;