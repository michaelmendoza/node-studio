from typing import Dict, List, Callable, Optional, Union, Any
from pydantic import BaseModel
from graph.enums import NodeType
from process.display import process_data, process_complex_data
from process.file.file import read_file, read_rawdata
from process.fit import fit
from process.mask import apply_mask
class NodeNumberOption(BaseModel):
    name: str
    range: List[int] = None

class NodeSelectOption(BaseModel):
    name: str
    select: List[str] = []
    default: None

class NodeBoolOption(BaseModel):
    name: str
    flag: bool
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
    NodeType.FILE_RAWDATA: NodeProps(type=NodeType.FILE_RAWDATA, name='File: Raw Data', description='Reads .dat file', output=['out'], options=['filepath', {'name':'datatype', 'select':['image','kspace']}, {'name':'avg_coils', 'flag': True }, {'name':'avg_averages', 'flag': True }, {'name':'avg_phase_cycles', 'flag': True }], fn=read_rawdata),
    
    # Computer Nodes
    NodeType.ADD: NodeProps(type=NodeType.ADD, name='Add', description='Adder', input=['a','b'], output=['out'], fn=lambda a, b: a + b),
    NodeType.MULT: NodeProps(type=NodeType.MULT, name='Mult', description='Multiplier', input=['a','b'], output=['out'], fn=lambda a, b: a * b),
    NodeType.MASK: NodeProps(type=NodeType.MASK, name='Mask', description='Mask generator', input=['a'], output=['out'], options=[{'name':'masktype', 'select':['circular', 'threshold']}], fn=apply_mask), 
    NodeType.FIT: NodeProps(type=NodeType.FIT, name='Fit', description='Linear Fit', input=['a'], output=['out'], fn=fit),

    # Output Nodes
    NodeType.DISPLAY: NodeProps(type=NodeType.DISPLAY, name='Display', description='Displays data as an image', input=['In'], fn=process_data),
    NodeType.CDISPLAY: NodeProps(type=NodeType.CDISPLAY, name='Display (Complex)', description='Displays complex data as an image', input=['In'], options=[{'name':'datatype', 'select':['mag','phase','real','imag']}], fn=process_complex_data)
}
