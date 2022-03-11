from typing import Dict, List, Callable, Optional, Union, Any
from pydantic import BaseModel
from graph.enums import NodeType
from process.file.file import read_file
from process.fit import fit
from process.mask import apply_mask
from process.SOS import sum_of_squares
from process.mock import mock_2d_data
from process.T2_map import qDESS_T2


class NodeNumberOption(BaseModel):
    name: str
    range: List[int] = None

class NodeSelectOption(BaseModel):
    name: str
    select: List[str] = []
    default: None

class NodeProps(BaseModel):
    type: NodeType
    name: str
    description: str = ''
    input: List[str] = []
    output: List[str] = []
    options: List[Union[str, Any]] = []
    fn: Callable = lambda x:x

NodeInfo = {
    # Variable Nodes
     NodeType.VARIABLE: NodeProps(type=NodeType.VARIABLE, name='Variable', description='A basic variable', output=['value'], options=['value']),

    # Input Nodes
    NodeType.FILE: NodeProps(type=NodeType.FILE, name='File', description='File input', output=['out'], options=[{'name':'filetype', 'select':['dcm','dat']}, 'filepath'], fn=read_file),
    NodeType.MOCK: NodeProps(type=NodeType.MOCK, name="Mock", description='Mock data generator', output=['out'], options=[{'name':'datapattern', 'select':['linear gradient','radial']}], fn=mock_2d_data),

    # Computer Nodes
    NodeType.ADD: NodeProps(type=NodeType.ADD, name='Add', description='Adder', input=['a','b'], output=['out'], fn=lambda a, b: a + b),
    NodeType.MULT: NodeProps(type=NodeType.MULT, name='Mult', description='Multiplier', input=['a','b'], output=['out'], fn=lambda a, b: a * b),
    NodeType.MASK: NodeProps(type=NodeType.MASK, name='Mask', description='Mask generator', input=['a'], output=['out'], options=[{'name':'masktype', 'select':['circular', 'threshold']}], fn=apply_mask), 
    NodeType.FIT: NodeProps(type=NodeType.FIT, name='Fit', description='Linear Fit', input=['a'], output=['out'], fn=fit),
    NodeType.SOS: NodeProps(type=NodeType.SOS, name='SOS', description='Sum of squares',input=['a','b'], output = ['out'], fn=sum_of_squares),
    NodeType.T2_qDESS: NodeProps(type=NodeType.T2_qDESS, name='qDESS T2 Mapping', description='T2 mapping from qDESS', input=['a'], output=['out'], fn=qDESS_T2),

    # Output Nodes
    NodeType.DISPLAY: NodeProps(type=NodeType.DISPLAY, name='Display', description='Displays data as an image', input=['a']) 
}
