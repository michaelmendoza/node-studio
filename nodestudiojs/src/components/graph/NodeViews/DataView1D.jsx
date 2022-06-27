import './ImageView.scss';
import { useState, useEffect } from 'react';
import { throttle } from '../../../libraries/utils';
import APIDataService from '../../../services/APIDataService';
import Slider from '../../base/Slider';
import LineAreaChart from '../../Charts/LineAreaChart';
import { toPointArray } from '../../../libraries/signal/Points';

const DataView1D = ({ node }) => {
    const [data, setData] = useState(null);
    const [index, setIndex] = useState(0); // Dim = 1
    const [dim, setDim] = useState(2); 

    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [node.view.update])

    const fetchData = () => {
        throttle(async () => {            
            if (!node.view.hasData) return;

            const key = generateNodeValueKey(node.view.shape);
            const startTime = performance.now();
            const data = await APIDataService.getNodeValueUncompressed(node.id, key)
            const endTime = performance.now();
            console.log('Time: ' + (endTime-startTime));

            if(data) {
                const _data = toPointArray(data.data)
                setData(_data);
            }
        }, 100, node.id + '-DataView1D')
    }

    const generateNodeValueKey = (shape) => {
        if (shape === [] || !shape) return '';

        const indices = node.view.indices;
        let key = '[';
        indices.forEach((value, i) => { 
            if (i === dim) key += ':';
            else key += value.toString();
            if (i < indices.length -1 ) key += ',';
        })
        key += ']';

        return key;
    }

    const handleIndexUpdate = (index, value) => {
        setIndex(value);
        node.view.updateIndex(index, value);
        if (node.view.hasData) fetchData() ;
    }

    const getMaxIndex = (dim) => {
        if (!node.view.hasData) return 1;
        const maxIndex = node.view.shape[dim] - 1
        if (index > maxIndex) 
            setIndex(maxIndex);
        return maxIndex ;
    }

    return (
        <div className="image-view">
            { data ? <div style={{ marginTop:'10px'}}> <label> Index for (Y) Dim: 1 </label> <Slider label={'Index'} value={index} onChange={(value) => handleIndexUpdate(1, value)} max={(() => getMaxIndex(1))()}></Slider>  </div>: null }
            { data ? <LineAreaChart width={310} height={310} data={data} type={'LineArea'}></LineAreaChart> : null }
        </div>
        
    )
}

export default DataView1D;