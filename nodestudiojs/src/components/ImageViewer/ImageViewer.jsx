import './ImageViewer.scss';
import Select from '../base/Select';
import { useState } from 'react';
import Image3dViewer from './Image3dViewer';
import Image2dViewer from './Image2dViewer';

const ImageViewer = ({node, nodeID}) => {

    const [mode, setMode] = useState({ label:'Transverse', value:'transverse' });
    const modeOptions = [   { label:'Transverse', value:'transverse' }, { label:'Coronal', value:'coronal' }, 
                            { label:'Sagittal', value:'sagittal' }, { label:'3D View', value:'3d' }];

    return (<div className="image-viewer">
        <div className="image-viewer-options layout-row" >
            <Select options={modeOptions} value={mode} placeholder={'Select Slice'} onChange={(option) => setMode(option)}></Select>
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