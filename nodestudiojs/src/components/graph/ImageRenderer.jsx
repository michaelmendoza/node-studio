import { useEffect,useContext, useState } from 'react';
import APIDataService from '../../services/APIDataService';
import { DrawImg } from '../../libraries/draw/Draw';
import { decodeDataset } from '../../libraries/signal/Dataset';
import { throttle } from '../../libraries/utils';
import { ActionTypes } from '../../state/AppReducers';
import AppState from '../../state/AppState';
import DefaultImg from  '../../images/default_image_icon.png';

const ImageRenderer = ({ nodeID, slice, index, colormap='bw', useFractionalIndex = true }) => {
    const {state, dispatch} = useContext(AppState.AppContext);
    const [imageData, setImageData] = useState(DefaultImg);
    
    useEffect(() => {
        fetchData(slice, index, colormap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.sessions, slice, index, colormap]);
    
    const fetchData = (slice, index, colormap) => {
        throttle(async () => {
            const metadata = await APIDataService.getNodeMetadata(nodeID);
            const shapeIndex = ({ 'xy':0, 'xz':1, 'yz':2 })[slice];

            // Select index and enforce valid indices 
            if (useFractionalIndex)  { 
                index = index < 0 ? 0 : index;
                index = index > 1 ? 1 : index;
                index = Math.floor(index * metadata.fullshape[shapeIndex]);
            }
            else {
                index = index < 0 ? 0 : index;
                index = index > metadata.fullshape[shapeIndex] ? metadata.fullshape[shapeIndex] : index
            }

            const encodedData = await APIDataService.getNode(nodeID, slice, index);
            if(encodedData) {
                const dataset = decodeDataset(encodedData);
                const dataUri = DrawImg(dataset, colormap);                
            
                setImageData(dataUri);
                dispatch({type:ActionTypes.UPDATE_SESSION, nodeID, update:false});
            }
        })
    }
    
    return (
        <img src={imageData} alt='viewport' style = {{width : '100%', height : '100%'}}></img>
    )

}
export default ImageRenderer;