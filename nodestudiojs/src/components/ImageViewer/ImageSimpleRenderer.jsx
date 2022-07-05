import { useEffect, useState, useRef } from 'react';
import APIDataService from '../../services/APIDataService';
import { DrawImg, getImgPixelValue } from '../../libraries/draw/Draw';
import { decodeDataset } from '../../libraries/signal/Dataset';
import { throttle } from '../../libraries/utils';
import DefaultImg from  '../../images/default_image_icon.png';
import WheelInput from '../base/WheelInput';

const ImageSimpleRenderer = ({ node, slice, colormap, updateIndex }) => {
    const imgRef = useRef(null);
    const [imageData, setImageData] = useState(DefaultImg);
    const [dataset, setDataset] = useState(null);
    const [position, setPosition] = useState({ x:0, y:0 });
    const [index, setIndex] = useState(0);

    useEffect(() => {
        fetchData(slice, colormap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [node.view.update, node.view.indices, slice, colormap])
    
    const fetchData = (slice, colormap) => {
        throttle(async () => {
            const shapeIndex = ({ 'xy':0, 'xz':1, 'yz':2 })[slice];
            const _index = node.view.indices[shapeIndex];
            setIndex(_index);

            const encodedData = await APIDataService.getNode(node.id, slice, _index);
            if(encodedData) {
                const dataset = decodeDataset(encodedData);
                const dataUri = DrawImg(dataset, node.view.colormap, node.view.contrast);
                setImageData(dataUri);
                setDataset(dataset);
            }
        }, 100, slice);
    }
    
    const handleMouseMove = (e) => {
        if(dataset === null) return;

        var rect = imgRef.current.getBoundingClientRect();
        const width = imgRef.current.clientWidth;
        const height = imgRef.current.clientHeight;
        const x = Math.round(dataset.shape[1] * (e.pageX - rect.left) / width);
        const y = Math.round(dataset.shape[0] * (e.pageY - rect.top) / height);
        setPosition({ x, y });
    }

    const handleWheelScroll = (e) => {
        const shapeIndex = ({ 'xy':0, 'xz':1, 'yz':2 })[slice];
        const _index = node.view.indices[shapeIndex];
        const maxIndex = node.view.shape[shapeIndex] - 1;

        const dIndex = e.deltaY > 0 ? 1 : -1;
        let new_index = _index + dIndex;
        new_index = new_index < 0 ? 0 : new_index;
        new_index = new_index > maxIndex ? maxIndex : new_index;

        node.view.updateIndex(shapeIndex, new_index);
        setIndex(new_index);
        if (updateIndex) updateIndex(new_index);
    }   

    const getImageValue = () => {
        if(dataset === null) return;
        return getImgPixelValue(dataset, position.x, position.y)
    }

    const zoom = dataset !== null ? imgRef.current.clientWidth / dataset.shape[1] : 1;

    return (
        <div style = {{ width : '100%', height : '100%', position: 'relative' }}>
            <div style={{ color:'#AAAAAA', margin:'0.5em', position: 'absolute', zIndex:1, fontSize:'0.8em' }}>
                <div> Frame: { index } </div>
                <div> Zoom: { (zoom * 100).toFixed(2) } % </div>
                <div> Pixel: { getImageValue() } ({ position.x }, { position.y }) </div>
            </div>
            <WheelInput onWheel={handleWheelScroll}>
                <img src={imageData} alt='viewport' ref={imgRef}  style = {{ width : '100%', height : '100%' }} onMouseMove={handleMouseMove}></img>
            </WheelInput>
        </div>
    )
}
export default ImageSimpleRenderer;