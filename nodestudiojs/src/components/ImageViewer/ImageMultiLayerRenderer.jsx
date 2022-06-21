import { useEffect, useState } from 'react';
import APIDataService from '../../services/APIDataService';
import { DrawImg, DrawLayers } from '../../libraries/draw/Draw';
import { decodeDataset } from '../../libraries/signal/Dataset';
import { throttle } from '../../libraries/utils';
import DefaultImg from  '../../images/default_image_icon.png';

const ImageMultiLayerRenderer = ({node, nodeID, slice, index, colormap='bw', useFractionalIndex = true }) => {
    const [imageData, setImageData] = useState(DefaultImg);
    
    useEffect(() => {
        fetchData(slice, index, colormap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [node.view.update, slice, index]);
    
    const fetchData = (slice, index, colormap) => {
        throttle(async () => {
            let metadata = await APIDataService.getNodeMetadata(nodeID);
            if(Array.isArray(metadata)) metadata = metadata[0];
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

            let encodedData = await APIDataService.getNode(nodeID, slice, index);
            if(!encodedData) return;

            if(Array.isArray(encodedData)) {
                const layers = encodedData.map((datum, i) => ({
                   data:decodeDataset(datum), colormap: i === 0 ? 'bw' : 'jet', threshold: i === 0 ? undefined : 0, opacity: i === 0 ? 1 : 0.9 
                }))
                const dataUri = DrawLayers(layers, layers[0].data.shape[1], layers[0].data.shape[0]);              
            
                setImageData(dataUri);
            }
            else {
                const dataset = decodeDataset(encodedData);
                const dataUri = DrawImg(dataset, colormap);                
            
                setImageData(dataUri);
            }
        })
    }
    
    return (
        <img src={imageData} alt='viewport' style = {{width : '100%', height : '100%'}}></img>
    )

}
export default ImageMultiLayerRenderer;