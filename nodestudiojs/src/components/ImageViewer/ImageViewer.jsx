import './ImageViewer.scss';
import Select from '../base/Select';
import { useState } from 'react';
import Image3dViewer from './Image3dViewer';
import Image2dViewer from './Image2dViewer';
import Slider from '../base/Slider';
import { useEffect } from 'react';
import { ActionTypes } from '../../state/AppReducers';
import { useAppState } from '../../state/AppState';

const ImageViewer = ({node, nodeID}) => {

    const { dispatch } = useAppState();
    const [mode, setMode] = useState({ label:'Transverse', value:'transverse' });
    const [contrastLevel, setContrastLevel] = useState(0);
    const [contrastWindow, setContrastWindow] = useState(0);
    const modeOptions = [   { label:'Transverse', value:'transverse' }, { label:'Coronal', value:'coronal' }, 
                            { label:'Sagittal', value:'sagittal' }, { label:'3D View', value:'3d' }];

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
        node.view.update++;
        dispatch({type: ActionTypes.UPDATE_NODE, node, updateAPI:false });
    }

    const handleContrastWindowUpdate = (value) => {
        setContrastWindow(value);
        node.view.contrast.useContrast = true;
        node.view.contrast.window = value;
        node.view.update++;
        dispatch({type: ActionTypes.UPDATE_NODE, node, updateAPI:false });

    }

    return (<div className="image-viewer">
        <div className="image-viewer-options layout-row" >
            <Select options={modeOptions} value={mode} placeholder={'Select Slice'} onChange={(option) => setMode(option)}></Select>
            <div className='contrast-controls'>
                <label> Contrast </label>
                <Slider label={'Level'} value={contrastLevel} onChange={handleContrastLevelUpdate} max={4096} min={0}></Slider>
                <Slider label={'Window'} value={contrastWindow} onChange={handleContrastWindowUpdate} max={4096} min={0}></Slider> 
            </div>
        </div>

        <div className='image-viewer-viewport'>
            {
                mode.value === 'transverse' ? <Image2dViewer node={node} nodeID={nodeID} slice={'xy'}></Image2dViewer>: null
            }
            {
                mode.value === 'coronal' ? <Image2dViewer node={node} nodeID={nodeID} slice={'xz'}></Image2dViewer>: null
            }
            {
                mode.value === 'sagittal' ? <Image2dViewer node={node} nodeID={nodeID} slice={'yz'}></Image2dViewer>: null
            }
            {
                mode.value === '3d' ? <Image3dViewer node={node} nodeID={nodeID}></Image3dViewer> : null
            }
        </div>
    </div>)
}


export default ImageViewer;