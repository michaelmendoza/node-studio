import { useEffect, useContext, useState, useRef } from 'react';
import APIDataService from '../../services/APIDataService';
import { DrawImg, getImgPixelValue } from '../../libraries/draw/Draw';
import { decodeDataset } from '../../libraries/signal/Dataset';
import { throttle } from '../../libraries/utils';
import { ActionTypes } from '../../state/AppReducers';
import AppState from '../../state/AppState';
import DefaultImg from  '../../images/default_image_icon.png';

const ImageRender = ({ slice, index, colormap, nodeID }) => {
    const {state, dispatch} = useContext(AppState.AppContext);
    const imgRef = useRef(null);
    const [imageData, setImageData] = useState(DefaultImg);
    const [dataset, setDataset] = useState(null);
    const [position, setPosition] = useState({ x:0, y:0 });

    useEffect(() => {
        fetchData(slice, index, colormap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.sessions, slice, index, colormap])
    
    const fetchData = (slice, index, colormap) => {
        throttle(async () => {
            const metadata = await APIDataService.getNodeMetadata(nodeID);
            const shapeIndex = ({ 'xy':0, 'xz':1, 'yz':2 })[slice];
            const new_index = Math.floor(index * metadata.fullshape[shapeIndex]);

            const encodedData = await APIDataService.getNode(nodeID, slice, new_index);
            if(encodedData) {
                const dataset = decodeDataset(encodedData);
                const dataUri = DrawImg(dataset, colormap);
                setImageData(dataUri);
                setDataset(dataset);
                dispatch({type:ActionTypes.UPDATE_SESSION, nodeID, update:false});
            }
        }, 100, slice);
    }
    
    const handleMouseMove = (e) => {
        if(dataset === null) return;

        var rect = imgRef.current.getBoundingClientRect();
        const width = imgRef.current.clientWidth
        const height = imgRef.current.clientHeight;
        const x = Math.round(dataset.shape[1] * (e.pageX - rect.left) / width);
        const y = Math.round(dataset.shape[0] * (e.pageY - rect.top) / height);
        setPosition({ x, y });
    }

    const getImageValue = () => {
        if(dataset === null) return;
        return getImgPixelValue(dataset, position.x, position.y)
    }

    return (
        <div style = {{ width : '100%', height : '100%', position: 'relative' }}>
            <div style={{ color:'#AAAAAA', margin:'0.5em', position: 'absolute', zIndex:1, fontSize:'0.8em' }}>
                <div> x: { position.x }, y:{ position.y } </div>
                <div> value: { getImageValue() } </div>
            </div>
            <img src={imageData} alt='viewport' ref={imgRef}  style = {{ width : '100%', height : '100%' }} onMouseMove={handleMouseMove}></img>
        </div>
    )

}
export default ImageRender;