
import APIDataService from '../services/APIDataService';

export const apiTest = async () => {
    const json_string = '{"nodes": [{"id": "4ce1b6d68a1211ec8516acde48001122", "props": {"type": "FILE", "x": 100, "y": 100, "input": [], "output": ["out"], "options": ["filetype", "filepath"], "args": {"filetype": "dicom", "filepath": "/Users/michael/projects/MRI/data/foot_data/"}}, "inputs": [], "output": ["4ce1c07c8a1211ec8516acde48001122"]}, {"id": "4ce1c07c8a1211ec8516acde48001122", "props": {"type": "MASK", "x": 200, "y": 100, "input": ["a"], "output": ["out"], "options": ["masktype"], "args": {"masktype": "circular"}}, "inputs": ["4ce1b6d68a1211ec8516acde48001122"], "output": ["4ce1c7c08a1211ec8516acde48001122"]}, {"id": "4ce1c7c08a1211ec8516acde48001122", "props": {"type": "DISPLAY", "x": 300, "y": 100, "input": ["a"], "output": [], "options": [], "args": {}}, "inputs": ["4ce1c07c8a1211ec8516acde48001122"], "output": []}], "links": [{"id": "4ce1c3068a1211ec8516acde48001122", "startNode": "4ce1b6d68a1211ec8516acde48001122", "endNode": "4ce1c07c8a1211ec8516acde48001122"}, {"id": "4ce1c89c8a1211ec8516acde48001122", "startNode": "4ce1c07c8a1211ec8516acde48001122", "endNode": "4ce1c7c08a1211ec8516acde48001122"}]}';
    await APIDataService.createGraph({json_string:json_string});
    const data = await APIDataService.getGraph();
    console.log(data);

    const result = await APIDataService.runSesson({id: '4ce1c7c08a1211ec8516acde48001122'});
    console.log(result);
    return result;
}
