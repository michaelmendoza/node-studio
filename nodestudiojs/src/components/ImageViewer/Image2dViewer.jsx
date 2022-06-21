import { useEffect, useRef, useState } from 'react';
import ImageSimpleRenderer from './ImageSimpleRenderer';

const Image2dViewer = ({node, nodeID, slice}) => {
    const imgRef = useRef(null);
    const [styles, setStyles] = useState({});
 
    useEffect(() => {
        const initalize = () => {
            const width = imgRef.current.clientWidth
            const height = imgRef.current.clientHeight;
            setStyles(width > height ? { width: '80vw' } : { height: '60vh' });
        }

        initalize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div style={styles} ref={imgRef}> 
            <ImageSimpleRenderer node={node} nodeID={nodeID} slice={slice}></ImageSimpleRenderer> 
        </div>
    )
}

export default Image2dViewer;