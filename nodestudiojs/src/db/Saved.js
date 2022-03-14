import APIDataService from '../services/APIDataService';
import Graph from '../models/Graph';

const json_string_dicom = `{"nodes": [
        {"id": "4ce1b6d68a1211ec8516acde48001122", "props": {"type": "FILE", "name": "File", "input": [], "output": ["out"], "options": ["filetype", "filepath"]}, "inputs": [], "outputs": ["4ce1c07c8a1211ec8516acde48001122"], "styles": {"x": 50, "y": 50}, "args": {"filetype": "dicom", "filepath": "/Users/michael/projects/MRI/data/foot_data/"}}, 
        {"id": "4ce1c07c8a1211ec8516acde48001122", "props": {"type": "MASK", "name": "Mask", "input": ["a"], "output": ["out"], "options": [{"name":"masktype", "select":["circular", "threshold"]}]}, "inputs": ["4ce1b6d68a1211ec8516acde48001122"], "outputs": ["4ce1c7c08a1211ec8516acde48001122"],  "styles": {"x": 250, "y": 50}, "args": {"masktype": "circular"}}, 
        {"id": "4ce1c7c08a1211ec8516acde48001122", "props": {"type": "DISPLAY", "name": "Display", "input": ["a"], "output": [], "options": []}, "inputs": ["4ce1c07c8a1211ec8516acde48001122"], "outputs": [], "styles": {"x": 450, "y": 50}, "args": {}}
    ], 
    "links": [
        {"id": "4ce1c3068a1211ec8516acde48001122", "startNode": "4ce1b6d68a1211ec8516acde48001122", "startPort": 0, "endNode": "4ce1c07c8a1211ec8516acde48001122", "endPort": 0}, 
        {"id": "4ce1c89c8a1211ec8516acde48001122", "startNode": "4ce1c07c8a1211ec8516acde48001122", "startPort": 0, "endNode": "4ce1c7c08a1211ec8516acde48001122", "endPort": 0}
    ]}`;
    
const json_string_rawdata = `{"nodes": [
    {"id": "4a1922cc-bff0-4aea-bee5-4853c6458bc6", "props": {"type": "FILE_RAWDATA", "name": "File: Raw Data", "description": "Reads .dat file", "input": [], "output": ["out"], "options": ["filepath", {"name": "datatype", "select": ["image", "kspace"]}, {"name": "avg_coils", "flag": true}, {"name": "avg_averages", "flag": true}, {"name": "avg_phase_cycles", "flag": true}]}, "inputs": [], "outputs": ["922ec681-f999-4691-bef7-9cc34ebaf5f2"], "styles": {"x": 219, "y": 59}, "args": {"filepath": "/Users/michael/projects/MRI/data/10182017_WholeBodyFat/meas_MID480_Ax___Thorax_gre_te523_FID3476.dat", "datatype": "image", "avg_coils": true, "avg_averages": true, "avg_phase_cycles": true}}, 
    {"id": "922ec681-f999-4691-bef7-9cc34ebaf5f2", "props": {"type": "CDISPLAY", "name": "Display (Complex)", "description": "Displays complex data as an image", "input": ["In"], "output": [], "options": [{"name": "datatype", "select": ["mag", "phase", "real", "imag"]}]}, "inputs": ["4a1922cc-bff0-4aea-bee5-4853c6458bc6"], "outputs": [], "styles": {"x": 530, "y": 54}, "args": {"datatype": "mag"}}
], 
    "links": [
        {"id": "1dff67a6-c50f-45bc-9403-6ffaf39767e2", "startNode": "4a1922cc-bff0-4aea-bee5-4853c6458bc6", "startPort": 0, "endNode": "922ec681-f999-4691-bef7-9cc34ebaf5f2", "endPort": 0}
    ]}`

export const savedProjectList = [
    { name: 'Dicom Test Project', description:'A dicom test project description', updatedAt: (new Date()).getTime(), json_string: json_string_dicom},
    { name: 'RawData Test Project', description:'A rawdata test project description', updatedAt: (new Date()).getTime(), json_string: json_string_rawdata}
];

export const load = async (json_string) => {
    await APIDataService.createGraph({json_string:json_string});
    return Graph.readJson(json_string);
}
