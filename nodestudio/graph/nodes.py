from typing import Dict, List, Callable
from pydantic import BaseModel
from graph.enums import NodeType
from process.file.file import read_file
from process.fit import fit
from process.mask import apply_mask

class NodeProps(BaseModel):
    type: NodeType
    x: int = 0
    y: int = 0
    input: List[str] = []
    output: List[str] = []
    options: List[str] = []
    fn: Callable = lambda x:x
    args: Dict = {}

NodeInfo = {
    # Variable Nodes
    NodeType.VARIABLE: NodeProps(type=NodeType.VARIABLE, output=['value'], options=['value']),

    # Input Nodes
    NodeType.FILE: NodeProps(type=NodeType.FILE, output=['out'], options=['filetype', 'filepath'], fn=read_file),

    # Computer Nodes
    NodeType.ADD: NodeProps(type=NodeType.ADD, input=['a','b'], output=['out'], fn=lambda a, b: a + b),
    NodeType.MULT: NodeProps(type=NodeType.MULT, input=['a','b'], output=['out'], fn=lambda a, b: a * b),
    NodeType.MASK: NodeProps(type=NodeType.MASK, input=['a'], output=['out'], options=['masktype'], fn=apply_mask), 
    NodeType.FIT: NodeProps(type=NodeType.FIT, input=['a'], output=['out'], fn=fit),

    # Output Nodes
    NodeType.DISPLAY: NodeProps(type=NodeType.DISPLAY, input=['a']) 
}
