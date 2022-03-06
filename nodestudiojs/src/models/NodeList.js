import APIDataService from "../services/APIDataService";

/*
const NodeList = [
    { type:'FILE', name: 'File', description: 'File input', outputLabels:['out'], options:['filetype', 'filepath'] },
    { type:'MASK', name: 'Mask', description: 'A mask generator', inputLabels:['a'], outputLabels:['out'], options:['masktype']},
    { type:'ADD', name: 'Add', description: 'Adder', inputLabels:['a','b'], outputLabels:['out']},
    { type:'MULT', name: 'Mult', description: 'Multiplier', inputLabels:['a','b'], outputLabels:['out']},
    { type:'FIT', name: 'Fit', description: 'Linear Fit', inputLabels:['a'], outputLabels:['out'] },
    { type:'DISPLAY', name: 'Display', description: 'Shows the image',  inputLabels:['a'] },
];
*/
const NodeList = {
    dict: {},
    list: []
}

NodeList.fetch = async () => {
    NodeList.dict = await APIDataService.getNodeList();
    NodeList.list = Object.values(NodeList.dict);
}

NodeList.getTypes = () => {
    return Object.keys(NodeList);
}

NodeList.getList = () => {
    return NodeList.list;
}

NodeList.getNode = (type) => {
    return NodeList.dict[type];
}

export const getNodeFromType = (type) => {
    return NodeList.getNode(type);
}

export default NodeList;