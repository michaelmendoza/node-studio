
import { apiTest } from '../../tests/api';
import { useRef, useState, useEffect } from 'react';
import { DrawImg } from '../../libraries/draw/Draw';
import { decodeDataset } from '../../libraries/signal/Dataset';
import APIDataService from '../../services/APIDataService';
import { throttle } from '../../libraries/utils';

const Viewport = () => {

    const [_img, setImg] = useState();
    const [ idx, setIdx ] = useState(0);

    const ref = useRef();
    useEffect(() => {
        ref.current.addEventListener('wheel', handleMouseWheel, { passive: false })
    }, [])

    const handleMouseWheel = (event) => {
        event.stopPropagation();
		event.preventDefault();

        setIdx((idx) => { 
            const maxIndex = 159
            const indexMove = event.wheelDelta > 0 ? 1 : -1;    // Update index
            let newIndex = Math.min(idx + indexMove, maxIndex); // Bound by maxIndex
            newIndex = Math.max(newIndex, 0);                   // Bound by minIndex i.e. 0
            console.log("Debug:MouseWheel", idx); 
            
            throttle(async () => {
                const encodedData = await APIDataService.getNode('4ce1c7c08a1211ec8516acde48001122', 'xy', newIndex);
                const dataset = decodeDataset(encodedData);
                const dataUri = DrawImg(dataset);
                setImg(dataUri);
            })

            return newIndex; 
        })
    }

    const handleClick = async () => {

        var start = new Date().getTime();

        const sessionData = await apiTest();        

        var end = new Date().getTime();
        var time = end - start;

        console.log(sessionData);
        console.log('Computed in ' + (time / 1000.0));
    }

    return (        
        <div className="viewport" ref={ref}>
            <div>
                <button onClick={handleClick}> API Test </button>
                <img src={_img} alt='test'/>
                <div>{idx}</div>
            </div>
        </div>
    )
}

export default Viewport;