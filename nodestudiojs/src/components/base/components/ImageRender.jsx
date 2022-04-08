import { useRef, useEffect,useContext, useState } from 'react';
import APIDataService from '../../../services/APIDataService';
import { DrawImg } from '../../../libraries/draw/Draw';
import { decodeDataset } from '../../../libraries/signal/Dataset';
import { throttle } from '../../../libraries/utils';
import { ActionTypes } from '../../../state/AppReducers';
import AppState from '../../../state/AppState';
import DefaultImg from  '../../../images/default_image_icon.png';


const ImageRender = ({slice,index,colormap,nodeID}) => {
    const {state, dispatch} = useContext(AppState.AppContext);
    const [imageData, setImageData] = useState(DefaultImg);
    // const [slice, setSlice] = useState('xy');
    const [sliceMax, setSliceMax] = useState(100);
    const [setIndex] = useState(0);
    const [shape, setShape] = useState([160, 640, 640]);
    //const [showModal, setShowModal] = useState(false);
    const [dataset, setDataset] = useState(null);
    //const [colormap,setColormap] = useState('bw');
    
    useEffect(() => {
        fetchData(slice, index, colormap);
    }, [state.sessions,slice,index,colormap])
    
    const fetchData = (slice, index, colormap) => {
        throttle(async () => {
            const encodedData = await APIDataService.getNode(nodeID, slice, 0);
            if (encodedData){
                setShape(encodedData.fullshape);
                updateSliceMax(slice);               
            }
            if (slice='xy'){
                var new_index = Math.floor(index*encodedData.fullshape[0]);
            }
            if (slice='xz'){
                var new_index = Math.floor(index*encodedData.fullshape[1]);
            }
            if (slice='yz'){
                var new_index = Math.floor(index*encodedData.fullshape[2]);
            }
            const encodedData2 = await APIDataService.getNode(nodeID, slice, new_index);
            if(encodedData2) {
                const dataset = decodeDataset(encodedData2);
                const dataUri = DrawImg(dataset, colormap);
                setDataset(dataset);
                setImageData(dataUri);
                dispatch({type:ActionTypes.UPDATE_SESSION, nodeID, update:false});
            }
        })
    }
    
    
    const updateSliceMax = (slice) => {
        let maxIndex;
        if (slice === 'xy')
            maxIndex = shape[0];
        if (slice === 'xz')
            maxIndex = shape[1];
        if (slice === 'yz')
            maxIndex = shape[2];
        setSliceMax(maxIndex);
    
        if (index > maxIndex) {
            setIndex(maxIndex-1);
            return maxIndex-1;
        }
        return index;
    }

    return (
        <img src={imageData} alt='viewport' style = {{width : '100%', height : '100%'}}></img>
    )

}
export default ImageRender;