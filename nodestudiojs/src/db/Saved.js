import APIDataService from '../services/APIDataService';
import Graph from '../models/Graph';

const json_string = `{"nodes": [
        {"id": "4ce1b6d68a1211ec8516acde48001122", "props": {"type": "FILE", "name": "File", "x": 50, "y": 50, "input": [], "output": ["out"], "options": ["filetype", "filepath"], "args": {"filetype": "dicom", "filepath": "/Users/michael/projects/MRI/data/foot_data/"}}, "inputs": [], "outputs": ["4ce1c07c8a1211ec8516acde48001122"]}, 
        {"id": "4ce1c07c8a1211ec8516acde48001122", "props": {"type": "MASK", "name": "Mask", "x": 250, "y": 50, "input": ["a"], "output": ["out"], "options": ["masktype"], "args": {"masktype": "circular"}}, "inputs": ["4ce1b6d68a1211ec8516acde48001122"], "outputs": ["4ce1c7c08a1211ec8516acde48001122"]}, 
        {"id": "4ce1c7c08a1211ec8516acde48001122", "props": {"type": "DISPLAY", "name": "Display", "x": 450, "y": 50, "input": ["a"], "output": [], "options": [], "args": {}}, "inputs": ["4ce1c07c8a1211ec8516acde48001122"], "outputs": []}
    ], 
    "links": [
        {"id": "4ce1c3068a1211ec8516acde48001122", "startNode": "4ce1b6d68a1211ec8516acde48001122", "endNode": "4ce1c07c8a1211ec8516acde48001122"}, 
        {"id": "4ce1c89c8a1211ec8516acde48001122", "startNode": "4ce1c07c8a1211ec8516acde48001122", "endNode": "4ce1c7c08a1211ec8516acde48001122"}
    ]}`;
    
export const savedProjectList = [{ name: 'Test Project', description:'A test project description', updatedAt: (new Date()).getTime(), json_string }];

export const load = async (json_string) => {
    await APIDataService.createGraph({json_string:json_string});
    //const data = await APIDataService.getGraph();
    return Graph.readJson(json_string);
}
