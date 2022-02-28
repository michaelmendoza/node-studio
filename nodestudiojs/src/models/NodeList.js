
const NodeList = [
    { type:'FILE', name: 'File', description: 'File input', output:['out'], options:['filetype', 'filepath'] },
    { type:'MASK', name: 'Mask', description: 'A mask generator', input:['a'], output:['out'], options:['masktype']},
    { type:'ADD', name: 'Add', description: 'Adder', input:['a','b'], output:['out']},
    { type:'MULT', name: 'Mult', description: 'Multiplier', input:['a','b'], output:['out']},
    { type:'FIT', name: 'Fit', description: 'Linear Fit', input:['a'], output:['out'] },
    { type:'DISPLAY', name: 'Display', description: 'Shows the image',  input:['a'] },
];

export const getNodeFromType = (type) => {
    return NodeList.find((item) => item.type === type);
}

export default NodeList;