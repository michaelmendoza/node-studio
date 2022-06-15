import { useEffect, useRef, useState } from 'react';
import ImageRender from './ImageSimpleRenderer';
import Slider from '../base/Slider';

const Image2dViewer = ({nodeID, slice}) => {
    const imgRef = useRef(null);
    const [styles, setStyles] = useState({});
    const [index, setIndex] = useState(0.5);
    const [levelIndex, setlevelIndex] = useState(0);
    const [widthIndex, setwidthIndex] = useState(0);

    useEffect(() => {
        const updateStyles = () => {
            const width = imgRef.current.clientWidth
            const height = imgRef.current.clientHeight;
            setStyles(width > height ? { width: '80vw' } : { height: '60vh' });
        }

        updateStyles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handlelevelIndexUpdate = (value) => {
        setlevelIndex(value);
    }
    const handlewidthIndexUpdate = (value) => {
        setwidthIndex(value);
    }

    return (
        <div style={styles} ref={imgRef}>
            <Slider label={'Window Level'} value={levelIndex} onChange={handlelevelIndexUpdate} max={500} min={-500}></Slider>
            <Slider label={'Window Size'} value={widthIndex} onChange={handlewidthIndexUpdate} max={500} min={-500}></Slider> 
            <ImageRender nodeID={nodeID} slice={slice} index={index} setIndex={setIndex} levelIndex={levelIndex} widthIndex={widthIndex}></ImageRender> 
        </div>
    )
}

export default Image2dViewer;