import './ImageViewer.scss';
import Select from '../base/Select';
import { useEffect, useRef, useState } from 'react';
import ImageRender from './ImageSimpleRenderer';
import Image3dViewer from './Image3dViewer';

const ImageViewer = ({nodeID}) => {
    const imgRef = useRef(null);
    const [styles, setStyles] = useState({});

    useEffect(() => {
        const updateStyles = () => {
            const width = imgRef.current.clientWidth
            const height = imgRef.current.clientHeight;
            setStyles(width > height ? { width: '80vw' } : { height: '60vh' });
        }

        updateStyles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const [mode, setMode] = useState({ label:'Transverse', value:'transverse' });
    const modeOptions = [{ label:'Transverse', value:'transverse' }, { label:'3D View', value:'3d' }];

    return (<div className="image-viewer">
        <div className="image-viewer-options layout-row" >
            <Select options={modeOptions} value={mode} placeholder={'Select Slice'} onChange={(option) => setMode(option)}></Select>
        </div>

        <div className='image-viewer-viewport'>
            {
                mode.value === 'transverse' ? <div style={styles} ref={imgRef}> <ImageRender nodeID={nodeID} slice={'xy'} index={0.1}></ImageRender> </div>: null
            }
            {
                mode.value === '3d' ? <Image3dViewer nodeID={nodeID}></Image3dViewer> : null
            }
        </div>
    </div>)
}


export default ImageViewer;