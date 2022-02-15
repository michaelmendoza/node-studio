
import { apiTest } from '../../tests/api';
import { useState } from 'react';
import { DrawSlice2D, SliceType } from '../../libraries/draw/Draw';
import { decodeDataset } from '../../libraries/signal/Dataset';

const Viewport = () => {

    const [_img, setImg] = useState();

    const handleClick = async () => {

        const encodedData = await apiTest();

        var start = new Date().getTime();
        
        const dataset = decodeDataset(encodedData);
        const dataUri = DrawSlice2D(dataset, SliceType.XY, 0);
        setImg(dataUri);

        var end = new Date().getTime();
        var time = end - start;
        console.log('Computed in ' + (time / 1000.0));
    }

    return (        
        <div className="viewport">
            <div>
                <button onClick={handleClick}> API Test </button>
                <img src={_img} alt='test'/>
            </div>
        </div>
    )
}

export default Viewport;