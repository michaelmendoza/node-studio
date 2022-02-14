
import APIDataService from '../../services/APIDataService';
const Viewport = () => {

    const handleClick = () => {
        const json_string = '{"nodes": [{"id": "4ce1b6d68a1211ec8516acde48001122", "props": {"type": "FILE", "x": 100, "y": 100, "input": [], "output": ["out"], "options": ["filetype", "filepath"], "args": {"filetype": "dicom", "filepath": "/Users/michael/projects/MRI/data/foot_data/"}}, "inputs": [], "output": ["4ce1c07c8a1211ec8516acde48001122"]}, {"id": "4ce1c07c8a1211ec8516acde48001122", "props": {"type": "MASK", "x": 200, "y": 100, "input": ["a"], "output": ["out"], "options": ["masktype"], "args": {"masktype": "circular"}}, "inputs": ["4ce1b6d68a1211ec8516acde48001122"], "output": ["4ce1c7c08a1211ec8516acde48001122"]}, {"id": "4ce1c7c08a1211ec8516acde48001122", "props": {"type": "DISPLAY", "x": 300, "y": 100, "input": ["a"], "output": [], "options": [], "args": {}}, "inputs": ["4ce1c07c8a1211ec8516acde48001122"], "output": []}], "links": [{"id": "4ce1c3068a1211ec8516acde48001122", "startNode": "4ce1b6d68a1211ec8516acde48001122", "endNode": "4ce1c07c8a1211ec8516acde48001122"}, {"id": "4ce1c89c8a1211ec8516acde48001122", "startNode": "4ce1c07c8a1211ec8516acde48001122", "endNode": "4ce1c7c08a1211ec8516acde48001122"}]}';
        APIDataService.createGraph({json_string:json_string});
        const data = APIDataService.getGraph()
        console.log(data);
    }

    return (        
        <div className="viewport">
            <div>
                <button onClick={handleClick}> API Test </button>
            </div>
        </div>
    )
}

export default Viewport;