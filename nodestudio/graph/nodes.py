from typing import Dict, List, Callable, Optional, Union, Any
from pydantic import BaseModel
from graph.enums import NodeType, NodeDetail
from process.core.fft import fft
from process.core.fit import fit
from process.core.mask import apply_mask, apply_threshold_mask
from process.core.undersampling import undersample
from process.io.display import process_data, process_complex_data, process_2channel_data
from process.io.file import read_file, read_rawdata
from process.phantom.phantom import phantom_generator
from process.simulation.mock import mock_2d_data
from process.quantative_map.T2_map import qDESS_T2
from process.recon.GRAPPA import grappa
from process.recon.SENSE import SENSErecon
from process.recon.cgSENSE import cgSolver
from process.integration.dosma.dosma_qdess import dosma_qDessT2mapping
from process.debug.debug import time_delay, error_node


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
    NodeType.VARIABLE: NodeProps(type=NodeType.VARIABLE, name='Variable', tags=['input'], description='A basic variable', detail=NodeDetail.VARIABLE, output=['value'], options=['value']),
    
    # Generator Nodes
    NodeType.MASK_GENERATOR: NodeProps(type=NodeType.MASK_GENERATOR, name='Mask Generator', tags=['generator'], description='Can generate simple masks', input=['data'], output=['out'], options=[], fn=process_data),
    NodeType.SHAPE_GENERATOR: NodeProps(type=NodeType.SHAPE_GENERATOR, name='Shape Generator', tags=['generator'], description='Can generate simple masks', input=['data'], output=['out'], options=[], fn=process_data),
    NodeType.MOCK: NodeProps(type=NodeType.MOCK, name="Mock", tags=['generator'], description='Mock data generator', detail=NodeDetail.MOCK, output=['out'], options=[{'name':'pattern', 'select':['linear','radial']}], fn=mock_2d_data),
    NodeType.PHANTOM: NodeProps(type=NodeType.PHANTOM, name="phantom", tags=['generator'], description='phantom generator', detail=NodeDetail.PHANTOM, output=['out'], options=[{'name':'type', 'select':['Shepp_logan','Brain']}, 'fov', 'coil'], fn=phantom_generator),

    # Filter Node
    NodeType.MASK: NodeProps(type=NodeType.MASK, name='Mask', tags=['filter'], description='Mask', detail=NodeDetail.MASK, input=['a'], output=['out'], options=[{'name':'masktype', 'select':['circular', 'threshold']}], fn=apply_mask), 
    NodeType.THRESHOLD_MASK: NodeProps(type=NodeType.THRESHOLD_MASK, name='Threshold Mask', tags=['filter'], description='Threshold Mask', detail=NodeDetail.THRESHOLD_MASK, input=['data'], output=['out'], options=['threshold'], fn=apply_threshold_mask), 

    # Compute Nodes
    NodeType.ADD: NodeProps(type=NodeType.ADD, name='Add', tags=['compute'], description='Adder', detail=NodeDetail.ADD, input=['a','b'], output=['out'], fn=lambda a, b: a + b),
    NodeType.MULT: NodeProps(type=NodeType.MULT, name='Mult', tags=['compute'], description='Multiplier', detail=NodeDetail.MULT, input=['a','b'], output=['out'], fn=lambda a, b: a * b),
    NodeType.FIT: NodeProps(type=NodeType.FIT, name='Fit', tags=['compute'], description='Linear Fit', input=['a'], detail=NodeDetail.FIT, output=['out'], fn=fit),
    NodeType.T2_qDESS: NodeProps(type=NodeType.T2_qDESS, name='qDESS T2 Mapping', tags=['compute'], description='T2 mapping from qDESS', detail=NodeDetail.T2_qDESS, input=['a'], output=['out'],options=[{'name':'tissue', 'select':['SciaticNerve']}], fn=qDESS_T2),
    NodeType.GRAPPA: NodeProps(type=NodeType.GRAPPA, name='GRAPPA Reconstruction', tags=['compute'], description='GRAPPA Reconstruction', detail=NodeDetail.GRAPPA, input=['a'], output=['out'], fn=grappa),
    NodeType.UNDERSAMPLE: NodeProps(type=NodeType.UNDERSAMPLE, name='Undersampling', tags=['compute'], description='Undersamples k-space', detail=NodeDetail.UNDERSAMPLE, input=['a'], output=['out'], options=[{'name':'type','select':['GRAPPA','SENSE']},'undersampling_ratio'], fn=undersample), 
    NodeType.SENSE: NodeProps(type=NodeType.SENSE, name='SENSE Reconstruction', tags=['compute'], description='SENSE Reconstruction', detail=NodeDetail.GRAPPA, input=['data','sensitivity_map'], output=['out'], fn=SENSErecon),
    NodeType.DOSMA_QDESS: NodeProps(type=NodeType.DOSMA_QDESS, name='DOSMA qdess', tags=['compute'], description='DOSMA qDESS', detail=NodeDetail.DOSMA_QDESS, options=['filepath',{'name':'tissuetype', 'select':['Femoral_cartilage','Tibial_cartilage','Patellar_cartilage','Meniscus']},'lowerBound','upperBound'], output=['out'], fn=dosma_qDessT2mapping),
    NodeType.CGSENSE: NodeProps(type=NodeType.CGSENSE, name='cg SENSE', tags=['compute'], description='cg SENSE', detail=NodeDetail.CGSENSE,  input=['Kspace_data','sensitivity_map'],options=['numIter'], output=['out'], fn=cgSolver),
    NodeType.FFT: NodeProps(type=NodeType.FFT, name='FFT', tags=['compute'], description='Fourier transform', detail=NodeDetail.DOSMA_QDESS, input=['f'],options=[{'name':'type', 'select':['fft','ifft']}], output=['out'], fn=fft),

    # Output Nodes
    NodeType.DISPLAY: NodeProps(type=NodeType.DISPLAY, name='Display', tags=['output'], description='Displays data as an image', detail=NodeDetail.DISPLAY, input=['In'], fn=process_data),
    NodeType.CDISPLAY: NodeProps(type=NodeType.CDISPLAY, name='Display (Complex)', tags=['output'], description='Displays complex data as an image', detail=NodeDetail.CDISPLAY, input=['In'], options=[{'name':'datatype', 'select':['mag','phase','real','imag']}], fn=process_complex_data),
    NodeType.LAYER_DISPLAY: NodeProps(type=NodeType.LAYER_DISPLAY, name='Layer Display', tags=['output'], description='Displays data as an image', detail=NodeDetail.LAYER_DISPLAY, input=['Layer 1', 'Layer 2'], fn=process_2channel_data),
    NodeType.HISTOGRAM: NodeProps(type=NodeType.HISTOGRAM, name='Histogram', tags=['output'], description='Displays data as histogram', detail=NodeDetail.HISTOGRAM, input=['In'], fn=process_data),

    # Debug Nodes
    NodeType.DELAY: NodeProps(type=NodeType.DELAY, name='Delay', tags=['debug'], description='Creates time delay', detail=NodeDetail.DELAY, input=['In'], output=['Out'], fn=time_delay),
    NodeType.ERROR: NodeProps(type=NodeType.ERROR, name='Error', tags=['debug'], description='Creates an error', detail=NodeDetail.ERROR, input=['In'], output=['Out'], fn=error_node),
}
