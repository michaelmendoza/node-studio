from typing import Dict, List, Callable, Optional, Union, Any
from pydantic import BaseModel
from graph.enums import NodeType, NodeDetail
from process.display import process_data, process_complex_data
from process.file.file import read_file, read_rawdata
from process.fit import fit
from process.mask import apply_mask
from process.SOS import sum_of_squares
from process.mock import mock_2d_data
from process.T2_map import qDESS_T2
from process.GRAPPA import GRAPPArecon
from process.undersample import undersample


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
    detail: NodeDetail = NodeDetail.BLANK
    tags: List[str] = []
    input: List[str] = []
    output: List[str] = []
    options: List[Union[str, Any]] = []
    fn: Callable = lambda x:x

NodeInfo = {
    # Variable Nodes
    NodeType.VARIABLE: NodeProps(type=NodeType.VARIABLE, name='Variable', description='A basic variable', detail=NodeDetail.VARIABLE, output=['value'], options=['value']),

    # Input Nodes
    NodeType.FILE: NodeProps(type=NodeType.FILE, name='File', description='File input', detail=NodeDetail.FILE, output=['out'], options=[{'name':'filetype', 'select':['dcm','dat','test']}, 'filepath'], fn=read_file),

    NodeType.MOCK: NodeProps(type=NodeType.MOCK, name="Mock", description='Mock data generator', detail=NodeDetail.MOCK, output=['out'], options=[{'name':'pattern', 'select':['linear','radial']}], fn=mock_2d_data),

    NodeType.FILE_RAWDATA: NodeProps(type=NodeType.FILE_RAWDATA, name='File: Raw Data', description='Reads .dat file', detail=NodeDetail.FILE_RAWDATA, output=['out'], options=['filepath', {'name':'datatype', 'select':['image','kspace']}, {'name':'avg_coils', 'flag': True }, {'name':'avg_averages', 'flag': True }, {'name':'avg_phase_cycles', 'flag': True }], fn=read_rawdata),
    
    # Computer Nodes
    NodeType.ADD: NodeProps(type=NodeType.ADD, name='Add', description='Adder', detail=NodeDetail.ADD, input=['a','b'], output=['out'], fn=lambda a, b: a + b),
    NodeType.MULT: NodeProps(type=NodeType.MULT, name='Mult', description='Multiplier', detail=NodeDetail.MULT, input=['a','b'], output=['out'], fn=lambda a, b: a * b),
    NodeType.MASK: NodeProps(type=NodeType.MASK, name='Mask', description='Mask generator', detail=NodeDetail.MASK, input=['a'], output=['out'], options=[{'name':'masktype', 'select':['circular', 'threshold']}], fn=apply_mask), 
    NodeType.FIT: NodeProps(type=NodeType.FIT, name='Fit', description='Linear Fit', input=['a'], detail=NodeDetail.FIT, output=['out'], fn=fit),
    NodeType.SOS: NodeProps(type=NodeType.SOS, name='SOS', description='Sum of squares',input=['a','b'], detail=NodeDetail.SOS, output = ['out'], fn=sum_of_squares),
    NodeType.T2_qDESS: NodeProps(type=NodeType.T2_qDESS, name='qDESS T2 Mapping', description='T2 mapping from qDESS', detail=NodeDetail.T2_qDESS, input=['a'], output=['out'],options=[{'name':'tissue', 'select':['SciaticNerve']}], fn=qDESS_T2),
    NodeType.GRAPPA: NodeProps(type=NodeType.GRAPPA, name='GRAPPA Reconstruction', description='GRAPPA Reconstruction', detail=NodeDetail.GRAPPA, input=['a'], output=['out'], fn=GRAPPArecon),
    NodeType.UNDERSAMPLE: NodeProps(type=NodeType.UNDERSAMPLE, name='Undersampler', description='Undersamples k-space', detail=NodeDetail.UNDERSAMPLE, input=['a'], output=['out'], options=['undersampling_ratio'], fn=apply_mask), 

    # Output Nodes
    NodeType.DISPLAY: NodeProps(type=NodeType.DISPLAY, name='Display', description='Displays data as an image', detail=NodeDetail.DISPLAY, input=['In'], fn=process_data),
    NodeType.CDISPLAY: NodeProps(type=NodeType.CDISPLAY, name='Display (Complex)', description='Displays complex data as an image', detail=NodeDetail.CDISPLAY, input=['In'], options=[{'name':'datatype', 'select':['mag','phase','real','imag']}], fn=process_complex_data)
}
