import './ImageViewer.scss';
import Select from '../base/Select';
import { useState } from 'react';
import Image3dViewer from './Image3dViewer';
import Image2dViewer from './Image2dViewer';

const ImageViewer = ({nodeID}) => {

    const [mode, setMode] = useState({ label:'Transverse', value:'transverse' });
    const modeOptions = [{ label:'Transverse', value:'transverse' }, { label:'3D View', value:'3d' }];

    return (<div className="image-viewer">
        <div className="image-viewer-options layout-row" >
            <Select options={modeOptions} value={mode} placeholder={'Select Slice'} onChange={(option) => setMode(option)}></Select>
        </div>

        <div className='image-viewer-viewport'>
            {
                mode.value === 'transverse' ? <Image2dViewer nodeID={nodeID}></Image2dViewer>: null
            }
            {
                mode.value === '3d' ? <Image3dViewer nodeID={nodeID}></Image3dViewer> : null
            }
        </div>
    </div>)
}


export default ImageViewer;