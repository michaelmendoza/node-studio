
const NodeList = [
    { type:'FILE', name: 'File', description: 'File input', outputLabels:['out'], options:['filetype', 'filepath'] },
    { type:'MASK', name: 'Mask', description: 'A mask generator', inputLabels:['a'], outputLabels:['out'], options:['masktype']},
    { type:'ADD', name: 'Add', description: 'Adder', inputLabels:['a','b'], outputLabels:['out']},
    { type:'MULT', name: 'Mult', description: 'Multiplier', inputLabels:['a','b'], outputLabels:['out']},
    { type:'FIT', name: 'Fit', description: 'Linear Fit', inputLabels:['a'], outputLabels:['out'] },
    { type:'DISPLAY', name: 'Display', description: 'Shows the image',  inputLabels:['a'] },
];

export const getNodeFromType = (type) => {
    return NodeList.find((item) => item.type === type);
}

export default NodeList;