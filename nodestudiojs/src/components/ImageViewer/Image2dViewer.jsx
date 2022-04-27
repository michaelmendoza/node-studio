import { useEffect, useRef, useState } from 'react';
import ImageRender from './ImageSimpleRenderer';

const Image2dViewer = ({nodeID, slice}) => {
    const imgRef = useRef(null);
    const [styles, setStyles] = useState({});
    const [index, setIndex] = useState(0.5);

    useEffect(() => {
        const updateStyles = () => {
            const width = imgRef.current.clientWidth
            const height = imgRef.current.clientHeight;
            setStyles(width > height ? { width: '80vw' } : { height: '60vh' });
        }

        updateStyles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div style={styles} ref={imgRef}> 
            <ImageRender nodeID={nodeID} slice={slice} index={index} setIndex={setIndex}></ImageRender> 
        </div>
    )
}

export default Image2dViewer;