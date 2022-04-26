import './ImageViewer.scss';
import Select from '../base/Select';
import { useState } from 'react';
import ImageRender from '../graph/ImageSimpleRenderer';
import Image3dViewer from '../graph/Image3dViewer';

const ImageViewer = ({nodeID}) => {

    const [mode, setMode] = useState({ label:'Transverse', value:'transverse' });
    const modeOptions = [{ label:'Transverse', value:'transverse' }, { label:'3D View', value:'3d' }];
    const handleModeUpdate = (option) => {
        setMode(option);
    }

    return (<div className="image-viewer">
        <div className="image-viewer-options layout-row" >
            <Select options={modeOptions} value={mode} placeholder={'Select Slice'} onChange={handleModeUpdate}></Select>
        </div>

        <div className='image-viewer-viewport'>
            {
                mode.value === 'transverse' ? <ImageRender nodeID={nodeID} slice={'xy'} index={0.1}></ImageRender> : null
            }
            {
                mode.value === '3d' ? <Image3dViewer nodeID={nodeID}></Image3dViewer> : null
            }
        </div>
    </div>)
}


export default ImageViewer;