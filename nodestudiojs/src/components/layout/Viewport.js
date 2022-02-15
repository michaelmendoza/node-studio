
import { apiTest } from '../../tests/api';
import { useState } from 'react';
import { DrawSlice2D, SliceType } from '../../libraries/draw/Draw';
import { histogram } from '../../libraries/signal/Histogram';

const Viewport = () => {

    const [_img, setImg] = useState();

    const handleClick = async () => {
        /*const json_string = '{"nodes": [{"id": "4ce1b6d68a1211ec8516acde48001122", "props": {"type": "FILE", "x": 100, "y": 100, "input": [], "output": ["out"], "options": ["filetype", "filepath"], "args": {"filetype": "dicom", "filepath": "/Users/michael/projects/MRI/data/foot_data/"}}, "inputs": [], "output": ["4ce1c07c8a1211ec8516acde48001122"]}, {"id": "4ce1c07c8a1211ec8516acde48001122", "props": {"type": "MASK", "x": 200, "y": 100, "input": ["a"], "output": ["out"], "options": ["masktype"], "args": {"masktype": "circular"}}, "inputs": ["4ce1b6d68a1211ec8516acde48001122"], "output": ["4ce1c7c08a1211ec8516acde48001122"]}, {"id": "4ce1c7c08a1211ec8516acde48001122", "props": {"type": "DISPLAY", "x": 300, "y": 100, "input": ["a"], "output": [], "options": [], "args": {}}, "inputs": ["4ce1c07c8a1211ec8516acde48001122"], "output": []}], "links": [{"id": "4ce1c3068a1211ec8516acde48001122", "startNode": "4ce1b6d68a1211ec8516acde48001122", "endNode": "4ce1c07c8a1211ec8516acde48001122"}, {"id": "4ce1c89c8a1211ec8516acde48001122", "startNode": "4ce1c07c8a1211ec8516acde48001122", "endNode": "4ce1c7c08a1211ec8516acde48001122"}]}';
        APIDataService.createGraph({json_string:json_string});
        const data = APIDataService.getGraph()
        console.log(data);*/

        const _data = await apiTest();
        const pixelArray = convertToPixelArray(_data);
        const stats = histogram(pixelArray);
        const data = { pixelArray, stats };
        data.shape = _data.shape;
        data.size = _data.size;

        console.log(stats);
        const dataUri = DrawSlice2D(data, SliceType.XY, 0);
        setImg(dataUri);

    }

    const convertToPixelArray = (data) => {
        const rawString = window.atob(data.encoded);
        const uint8Array = new Uint8Array(rawString.length);
        for(var i = 0; i < rawString.length; i++)
        {
            uint8Array[i] = rawString.charCodeAt(i);
        }
        const pixelArray = new Uint16Array(uint8Array.buffer);
        console.log(pixelArray);
        return pixelArray;
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