import './ImageView.scss';
import { useState, useEffect } from 'react';
import { DrawImg } from '../../../libraries/draw/Draw';
import { throttle } from '../../../libraries/utils';
import APIDataService from '../../../services/APIDataService';
import { decodeDataset } from '../../../libraries/signal/Dataset';

const DataView = ({node, nodeID}) => {
    const [imageData, setImageData] = useState(null);
    const [xIndex, setXIndex] = useState(1);   
    const [yIndex, setYIndex] = useState(2);

    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [node.view.update])

    const fetchData = () => {
        throttle(async () => {            
            if (!node.view.hasData) return;

            const key = generateNodeValueKey(node.view.shape);
            const startTime = performance.now();
            const data = await APIDataService.getNodeValue(nodeID, key)
            const endTime = performance.now();
            console.log('Time: ' + (endTime-startTime));

            if(data) {
                const dataset = decodeDataset(data);
                const dataUri = DrawImg(dataset);
                setImageData(dataUri);
            }
        }, 100, nodeID)
    }

    const generateNodeValueKey = (shape) => {
        if (shape === [] || !shape) return '';

        const indices = node.view.indices;
        let key = '[';
        indices.forEach((value, i) => { 
            if (i === xIndex || i === yIndex) key += ':';
            else key += value.toString();
            if (i < indices.length -1 ) key += ',';
        })
        key += ']';

        return key;
    }

    return (
        <div className="image-view">
            { imageData ? <img src={imageData} alt='viewport'/> : null }
        </div>
        
    )
}

export default DataView;