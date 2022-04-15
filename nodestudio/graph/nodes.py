# from socket import send_fds
from typing import Dict, List, Callable, Optional, Union, Any
# from matplotlib.pyplot import get
from pydantic import BaseModel
from graph.enums import NodeType, NodeDetail
from process.display import process_data, process_complex_data
from process.file.file import read_file, read_rawdata
from process.fit import fit
from process.mask import apply_mask
from process.SOS import sum_of_squares, complex_root_sum_of_squares
from process.mock import mock_2d_data
from process.T2_map import qDESS_T2
from process.GRAPPA import GRAPPArecon
from process.undersampling import undersample
from process.sensitivity_map import get_sensitivity_map
from process.SENSE import SENSErecon


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
    tags: List[str] = []
    description: str = ''
    detail: NodeDetail = NodeDetail.BLANK
    input: List[str] = []
    output: List[str] = []
    options: List[Union[str, Any]] = []
    fn: Callable = lambda x:x

NodeInfo = {

    # Input Nodes
    NodeType.FILE: NodeProps(type=NodeType.FILE, name='File', tags=['input'], description='File input', detail=NodeDetail.FILE, output=['out'], options=[{'name':'filetype', 'select':['dcm','dat','test']}, 'filepath'], fn=read_file),
    NodeType.FILE_RAWDATA: NodeProps(type=NodeType.FILE_RAWDATA, name='File: Raw Data', tags=['input'], description='Reads .dat file', detail=NodeDetail.FILE_RAWDATA, output=['out'], options=['filepath', {'name':'datatype', 'select':['image','kspace']}, {'name':'avg_coils', 'flag': True }, {'name':'avg_averages', 'flag': True }, {'name':'avg_phase_cycles', 'flag': True }], fn=read_rawdata),
    NodeType.MOCK: NodeProps(type=NodeType.MOCK, name="Mock", tags=['input'], description='Mock data generator', detail=NodeDetail.MOCK, output=['out'], options=[{'name':'pattern', 'select':['linear','radial']}], fn=mock_2d_data),
    NodeType.VARIABLE: NodeProps(type=NodeType.VARIABLE, name='Variable', tags=['input'], description='A basic variable', detail=NodeDetail.VARIABLE, output=['value'], options=['value']),
    
    # Generator Nodes
    NodeType.MASK_GENERATOR: NodeProps(type=NodeType.MASK_GENERATOR, name='Mask Generator', tags=['generator'], description='Can generate simple masks', input=['data'], output=['out'], options=[], fn=process_data),

    # Compute Nodes
    NodeType.ADD: NodeProps(type=NodeType.ADD, name='Add', tags=['compute'], description='Adder', detail=NodeDetail.ADD, input=['a','b'], output=['out'], fn=lambda a, b: a + b),
    NodeType.MULT: NodeProps(type=NodeType.MULT, name='Mult', tags=['compute'], description='Multiplier', detail=NodeDetail.MULT, input=['a','b'], output=['out'], fn=lambda a, b: a * b),
    NodeType.MASK: NodeProps(type=NodeType.MASK, name='Mask', tags=['compute'], description='Mask generator', detail=NodeDetail.MASK, input=['a'], output=['out'], options=[{'name':'masktype', 'select':['circular', 'threshold']}], fn=apply_mask), 
    NodeType.FIT: NodeProps(type=NodeType.FIT, name='Fit', tags=['compute'], description='Linear Fit', input=['a'], detail=NodeDetail.FIT, output=['out'], fn=fit),
    NodeType.SOS: NodeProps(type=NodeType.SOS, name='SOS', tags=['compute'], description='Sum of squares',input=['a','b'], detail=NodeDetail.SOS, output = ['out'], fn=sum_of_squares),
    NodeType.CRSOS: NodeProps(type=NodeType.CRSOS, name='Complex RSOS', tags=['compute'], description='Complex root sum of squares',input=['a'], detail=NodeDetail.CRSOS, output = ['out'], fn=complex_root_sum_of_squares),
    NodeType.T2_qDESS: NodeProps(type=NodeType.T2_qDESS, name='qDESS T2 Mapping', tags=['compute'], description='T2 mapping from qDESS', detail=NodeDetail.T2_qDESS, input=['a'], output=['out'],options=[{'name':'tissue', 'select':['SciaticNerve']}], fn=qDESS_T2),
    NodeType.GRAPPA: NodeProps(type=NodeType.GRAPPA, name='GRAPPA Reconstruction', tags=['compute'], description='GRAPPA Reconstruction', detail=NodeDetail.GRAPPA, input=['a'], output=['out'], fn=GRAPPArecon),
    NodeType.UNDERSAMPLE: NodeProps(type=NodeType.UNDERSAMPLE, name='Undersampling', tags=['compute'], description='Undersamples k-space', detail=NodeDetail.UNDERSAMPLE, input=['a'], output=['out'], options=[{'name':'type','select':['GRAPPA','SENSE']},'undersampling_ratio'], fn=undersample), 
    NodeType.SENSITIVITY_MAP: NodeProps(type=NodeType.SENSITIVITY_MAP,name='Sensitivity Map',tags=['compute'], description='Calculates sensitivity map',detail=NodeDetail.UNDERSAMPLE, input=['a'], output=['out'], options=[{'name':'conjugate', 'flag': True }], fn=get_sensitivity_map),
    NodeType.SENSE: NodeProps(type=NodeType.SENSE, name='SENSE Reconstruction', tags=['compute'], description='SENSE Reconstruction', detail=NodeDetail.GRAPPA, input=['data','sensitivity_map'], output=['out'], fn=SENSErecon),

    # Output Nodes
    NodeType.DISPLAY: NodeProps(type=NodeType.DISPLAY, name='Display', tags=['output'], description='Displays data as an image', detail=NodeDetail.DISPLAY, input=['In'], fn=process_data),
    NodeType.CDISPLAY: NodeProps(type=NodeType.CDISPLAY, name='Display (Complex)', tags=['output'], description='Displays complex data as an image', detail=NodeDetail.CDISPLAY, input=['In'], options=[{'name':'datatype', 'select':['mag','phase','real','imag']}], fn=process_complex_data)
}
