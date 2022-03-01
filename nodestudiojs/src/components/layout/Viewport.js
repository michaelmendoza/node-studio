
import { useRef, useState, useEffect } from 'react';
import { DrawImg } from '../../libraries/draw/Draw';
import { decodeDataset } from '../../libraries/signal/Dataset';
import APIDataService from '../../services/APIDataService';
import { throttle } from '../../libraries/utils';
import Select from '../base/Select';
import { encodeTest } from '../../tests/encode.test';

const Viewport = () => {

    const ref = useRef();
    const [_img, setImg] = useState();
    const [idx, setIdx] = useState(0);
    const [slice, setSlice] = useState('xy');

    useEffect(()=>{
        setImg(encodeTest())
    }, [])

    const handleMouseWheel = (event) => {
        event.stopPropagation();

        setIdx((idx) => { 
            const maxIndex = 159
            const indexMove = event.deltaY > 0 ? 1 : -1;    // Update index
            let newIndex = Math.min(idx + indexMove, maxIndex); // Bound by maxIndex
            newIndex = Math.max(newIndex, 0);                   // Bound by minIndex i.e. 0
            console.log("Debug:MouseWheel", idx); 

            fetchData(slice, newIndex);
            return newIndex; 
        })
    }

    const fetchData = (slice, index) => {
        throttle(async () => {
            const encodedData = await APIDataService.getNode('4ce1c7c08a1211ec8516acde48001122', slice, index);
            const dataset = decodeDataset(encodedData);
            const dataUri = DrawImg(dataset);
            setImg(dataUri);
        })
    }
    
    const handleOptionUpdate = (option) => {
        setSlice(option.value);
        fetchData(option.value, idx)
    }

    const options = [{label:'xy', value:'xy'}, {label:'xz', value:'xz'}, {label:'yz', value:'yz'}]

    return (        
        <div className="viewport" ref={ref} onWheel={handleMouseWheel}>
            <div>
                <img src={_img} alt='test'/>
                <div>{idx}</div>
                {slice}
                <Select options={options} onChange={handleOptionUpdate}></Select>
            </div>
        </div>
    )
}

export default Viewport;