import { useEffect, useState } from 'react';
import APIDataService from '../../services/APIDataService';
import { DrawImg } from '../../libraries/draw/Draw';
import { decodeDataset } from '../../libraries/signal/Dataset';
import { throttle } from '../../libraries/utils';
import DefaultImg from  '../../images/default_image_icon.png';

const ImageMultiLayerRenderer = ({node, nodeID, slice, index, colormap='bw', useFractionalIndex = true }) => {
    const [imageData, setImageData] = useState(DefaultImg);
    const [imageData2, setImageData2] = useState(DefaultImg);

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
                const dataset1 = decodeDataset(encodedData[0]);
                const dataset2 = decodeDataset(encodedData[1]);
                const dataUri1 = DrawImg(dataset1, 'bw', undefined, undefined);
                const dataUri2 = DrawImg(dataset2, 'jet', undefined, 0);

                setImageData(dataUri1);
                setImageData2(dataUri2);
            }
            else {
                const dataset = decodeDataset(encodedData);
                const dataUri = DrawImg(dataset, colormap);                
            
                setImageData(dataUri);
            }
        }, 100, node.id + '-ImageMultiLayerRenderer')
    }
    
    return (
        <div style={{ position:'relative'}}>
            <img src={imageData} alt='viewport' style = {{width : '100%', height : '100%'}}></img>
            <img src={imageData2} alt='viewport' style = {{width : '100%', height : '100%', position:'absolute', left:'0', top:'-0.5em'}}></img>
        </div>
        
    )

}
export default ImageMultiLayerRenderer;