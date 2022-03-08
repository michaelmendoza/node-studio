import APIDataService from '../services/APIDataService';
import Graph from '../models/Graph';

const json_string = `{"nodes": [
        {"id": "4ce1b6d68a1211ec8516acde48001122", "props": {"type": "FILE", "name": "File", "input": [], "output": ["out"], "options": ["filetype", "filepath"]}, "inputs": [], "outputs": ["4ce1c07c8a1211ec8516acde48001122"], "styles": {"x": 50, "y": 50}, "args": {"filetype": "dicom", "filepath": "/Users/michael/projects/MRI/data/foot_data/"}}, 
        {"id": "4ce1c07c8a1211ec8516acde48001122", "props": {"type": "MASK", "name": "Mask", "input": ["a"], "output": ["out"], "options": [{"name":"masktype", "select":["circular", "threshold"]}]}, "inputs": ["4ce1b6d68a1211ec8516acde48001122"], "outputs": ["4ce1c7c08a1211ec8516acde48001122"],  "styles": {"x": 250, "y": 50}, "args": {"masktype": "circular"}}, 
        {"id": "4ce1c7c08a1211ec8516acde48001122", "props": {"type": "DISPLAY", "name": "Display", "input": ["a"], "output": [], "options": []}, "inputs": ["4ce1c07c8a1211ec8516acde48001122"], "outputs": [], "styles": {"x": 450, "y": 50}, "args": {}}
    ], 
    "links": [
        {"id": "4ce1c3068a1211ec8516acde48001122", "startNode": "4ce1b6d68a1211ec8516acde48001122", "startPort": 0, "endNode": "4ce1c07c8a1211ec8516acde48001122", "endPort": 0}, 
        {"id": "4ce1c89c8a1211ec8516acde48001122", "startNode": "4ce1c07c8a1211ec8516acde48001122", "startPort": 0, "endNode": "4ce1c7c08a1211ec8516acde48001122", "endPort": 0}
    ]}`;
    
export const savedProjectList = [{ name: 'Test Project', description:'A test project description', updatedAt: (new Date()).getTime(), json_string }];

export const load = async (json_string) => {
    await APIDataService.createGraph({json_string:json_string});
    //const data = await APIDataService.getGraph();
    return Graph.readJson(json_string);
}
