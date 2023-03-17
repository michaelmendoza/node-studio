from graph.interfaces import NodeProps
from graph.enums import  NodeType, NodeDetail
from core import io, dataset, aggregate
from process.core.fft import fft_recon
from process.core.fit import fit
from process.core.mask import apply_mask, apply_threshold_mask, apply_positive_mask
from process.core.undersampling import undersample
from process.core.resize import resize2D
from process.core.sensitivity_map import get_sensitivity_map
from process.io.display import process_data, process_2channel_data, process_historam
from process.phantom.phantom import phantom_generator
from process.simulation.mock import mock_2d_data
from process.quantative_map.T2_map import qDESS_T2
from process.recon.SOS import sum_of_squares, complex_root_sum_of_squares
from process.recon.GRAPPA import grappa
from process.recon.SENSE import SENSErecon
from process.recon.cgSENSE import cgSENSE
from process.integration.dosma.dosma_qdess import dosma_qDessT2mapping
from process.integration.dosma.dosma_segmentation import dosma_segmentation
from process.debug.debug import time_delay, error_node
from process.quantative_map.qDESS_ADC import qDESS_ADC
from process.integration.MIRTorch.cs import MIRTorch_compressed_sensing
from process.recon.partialFourier import partialFourierRecon
from process.io.export import export_data
from process.recon.sms import sms

from process.generator import TISSUE
from process.simulation import SSFP, SSFP_SPECTRUM
from process.ssfp import SSFP_BAND_REMOVAL, SSFP_PLANET, SSFP_SFOV

NodeInfo = {

    # Input Nodes
    NodeType.FILE: NodeProps(type=NodeType.FILE, name='File', tags=['input'], description='File input', detail=NodeDetail.FILE, output=['out'], fn=io.get_filedata),
    #NodeType.VARIABLE: NodeProps(type=NodeType.VARIABLE, name='Variable', tags=['input'], description='A basic variable', detail=NodeDetail.VARIABLE, output=['value'], options=['value']),

    # Generator Nodes
    #NodeType.MASK_GENERATOR: NodeProps(type=NodeType.MASK_GENERATOR, name='Mask Generator', tags=['generator'], description='Can generate simple masks', input=['data'], output=['out'], options=[], fn=process_data),
    #NodeType.SHAPE_GENERATOR: NodeProps(type=NodeType.SHAPE_GENERATOR, name='Shape Generator', tags=['generator'], description='Can generate simple masks', input=['data'], output=['out'], options=[], fn=process_data),
    #NodeType.MOCK: NodeProps(type=NodeType.MOCK, name="Mock", tags=['generator'], description='Mock data generator', detail=NodeDetail.MOCK, output=['out'], options=[{'name':'pattern', 'select':['linear','radial']}], fn=mock_2d_data),
    NodeType.PHANTOM: NodeProps(type=NodeType.PHANTOM, name="phantom", tags=['generator'], description='phantom generator', detail=NodeDetail.PHANTOM, output=['out'], options=[{'name':'type', 'select':['Shepp_logan','Brain', 'SMS']}, 'fov', 'coil'], fn=phantom_generator),
    NodeType.TISSUE: TISSUE(),

    # Simulation Nodes
    NodeType.SSFP: SSFP(),
    NodeType.SSFP_SPECTRUM: SSFP_SPECTRUM(),

    # SSFP Nodes
    NodeType.SSFP_BAND_REMOVAL: SSFP_BAND_REMOVAL(),
    NodeType.SSFP_PLANET: SSFP_PLANET(),
    NodeType.SSFP_SFOV: SSFP_SFOV(),

    # Filter Node
    #NodeType.MASK: NodeProps(type=NodeType.MASK, name='Mask', tags=['filter'], description='Mask', detail=NodeDetail.MASK, input=['a'], output=['out'], options=[{'name':'masktype', 'select':['circular', 'threshold']}], fn=apply_mask), 
    NodeType.MASK: NodeProps(type=NodeType.MASK, name='Mask', tags=['filter'], description='Applies linear rectified mask', detail=NodeDetail.MASK, input=['dataset','mask'], output=['out'], fn=apply_positive_mask), 
    NodeType.THRESHOLD_MASK: NodeProps(type=NodeType.THRESHOLD_MASK, name='Threshold Mask', tags=['filter'], description='Threshold Mask', detail=NodeDetail.THRESHOLD_MASK, input=['data'], output=['out'], options=['threshold'], fn=apply_threshold_mask), 
    NodeType.GROUP_BY: NodeProps(type=NodeType.GROUP_BY, name='Group By', tags=['filter'], description='Group dataset by tag', detail=NodeDetail.GROUP_BY, options=[{'name':'group_by','select':['EchoNumber']}], input=['dataset'], output=['out'], fn=aggregate.group_by),

    # Compute Nodes
    NodeType.ADD: NodeProps(type=NodeType.ADD, name='Add', tags=['compute'], description='Adder', detail=NodeDetail.ADD, input=['a','b'], output=['out'], fn=lambda a, b: a + b),
    NodeType.MULT: NodeProps(type=NodeType.MULT, name='Mult', tags=['compute'], description='Multiplier', detail=NodeDetail.MULT, input=['a','b'], output=['out'], fn=lambda a, b: a * b),
    #NodeType.FIT: NodeProps(type=NodeType.FIT, name='Fit', tags=['compute'], description='Linear Fit', input=['a'], detail=NodeDetail.FIT, output=['out'], fn=fit),
    NodeType.SOS: NodeProps(type=NodeType.SOS, name='SOS', tags=['compute'], description='Sum of squares',input=['a','b'], detail=NodeDetail.SOS, output = ['out'], fn=sum_of_squares),
    #NodeType.CRSOS: NodeProps(type=NodeType.CRSOS, name='Complex RSOS', tags=['compute'], description='Complex root sum of squares',input=['a'], detail=NodeDetail.CRSOS, output = ['out'], fn=complex_root_sum_of_squares),
    #NodeType.T2_qDESS: NodeProps(type=NodeType.T2_qDESS, name='qDESS T2 Mapping', tags=['compute'], description='T2 mapping from qDESS', detail=NodeDetail.T2_qDESS, input=['a'], output=['out'],options=[{'name':'tissue', 'select':['SciaticNerve']}], fn=qDESS_T2),
    NodeType.GRAPPA: NodeProps(type=NodeType.GRAPPA, name='GRAPPA', tags=['compute'], description='GRAPPA Reconstruction', detail=NodeDetail.GRAPPA, input=['data','ref'], output=['out'], fn=grappa),
    NodeType.UNDERSAMPLE: NodeProps(type=NodeType.UNDERSAMPLE, name='Undersampling', tags=['compute'], description='Undersamples k-space', detail=NodeDetail.UNDERSAMPLE, input=['a'], output=['data', 'ref'], options=[{'name':'type','select':['GRAPPA', 'SENSE', 'Variable Density', 'SMS_CAIPI', 'Partial Fourier']},'undersampling_ratio'], fn=undersample), 
    NodeType.RESIZE: NodeProps(type=NodeType.RESIZE, name='Resize', tags=['compute'], description='Resizes image data', detail=NodeDetail.RESIZE, input=['a'], output=['out'], options=['height','width'], fn=resize2D),
    NodeType.SENSITIVITY_MAP: NodeProps(type=NodeType.SENSITIVITY_MAP,name='Sensitivity Map', tags=['compute'], description='Calculates sensitivity map', detail=NodeDetail.UNDERSAMPLE, input=['Kspace_data'], output=['out'], fn=get_sensitivity_map),
    NodeType.SENSE: NodeProps(type=NodeType.SENSE, name='SENSE Reconstruction', tags=['compute'], description='SENSE Reconstruction', detail=NodeDetail.SENSE, input=['data','ref'], output=['out'], fn=SENSErecon),
    NodeType.DOSMA_QDESS: NodeProps(type=NodeType.DOSMA_QDESS, name='T2 Mapping', tags=['compute'], description='T2 Mapping (DOSMA-QDESS)', detail=NodeDetail.DOSMA_QDESS, options=[{'name':'tissuetype', 'select':['Femoral Cartilage','Tibial Cartilage','Patellar Cartilage','Meniscus']}], input=['datagroup'], output=['out'], fn=dosma_qDessT2mapping),
    NodeType.DOSMA_SEGMENTATION: NodeProps(type=NodeType.DOSMA_SEGMENTATION, name='Segmentation', tags=['compute'], description='Seqmentation (DOSMA)', detail=NodeDetail.DOSMA_SEGMENTATION, options=[{'name':'tissuetype', 'select':['Femoral Cartilage','Tibial Cartilage','Patellar Cartilage','Meniscus']}], input=['datagroup'], output=['out'], fn=dosma_segmentation),
    NodeType.CGSENSE: NodeProps(type=NodeType.CGSENSE, name='cg SENSE', tags=['compute'], description='cg SENSE', detail=NodeDetail.CGSENSE,  input=['data','ref'],options=['numIter'], output=['out'], fn=cgSENSE),
    NodeType.FFT: NodeProps(type=NodeType.FFT, name='FFT', tags=['compute'], description='Fourier transform', detail=NodeDetail.FFT, input=['data'],options=[{'name':'type', 'select':['fft','ifft']}], output=['out'], fn=fft_recon),
    NodeType.QDESS_ADC: NodeProps(type=NodeType.QDESS_ADC, name='QDESS_ADC', tags=['compute'], description='QDESS ADC', detail=NodeDetail.QDESS_ADC, input=['scan1', 'scan2'],options=[{'name':'method', 'select':['Bragi','Bieri']}, 'spoiler_duration_ms', 'gradient_area1', 'gradient_area2'], output=['out'], fn=qDESS_ADC),
    NodeType.MIRTorch_CS: NodeProps(type=NodeType.MIRTorch_CS, name='MIRTorch_CS', tags=['compute'], description='MIRTorch Compressed Sensing', detail=NodeDetail.MIRTorch_CS, input=['data'],options=[{'name':'method', 'select':['POGM','FBPD', 'FISTA']},{'name':'device', 'select':['cpu','gpu']}], output=['out'], fn=MIRTorch_compressed_sensing),
    NodeType.PARTIAL_FOURIER: NodeProps(type=NodeType.PARTIAL_FOURIER, name='Partial Fourier', tags=['compute'], description='Partial Fourier reconstruction', detail=NodeDetail.PARTIAL_FOURIER, input=['data', 'ref'], output=['recon'], options=[{'name':'type','select':['Conjugate Synthesis','POCS','Homodyne']}], fn=partialFourierRecon), 
    NodeType.SMS_RECON: NodeProps(type=NodeType.SMS_RECON, name='SMS Reconstruction', tags=['compute'], description='SMS Reconstruction', detail=NodeDetail.SMS_RECON, input=['data','ref'], options=[{'name':'type','select':['SG', 'SG_CAIPI', 'SPSG', 'SPSG_CAIPI', 'SG2K', 'SG2K_CAIPI', 'SPSG2K', 'SPSG2K_CAIPI']}], output=['out'], fn=sms),
    
    # Output Nodes
    NodeType.DISPLAY: NodeProps(type=NodeType.DISPLAY, name='Display', tags=['output'], description='Displays data as an image', detail=NodeDetail.DISPLAY, input=['In'], fn=process_data),
    NodeType.LINE_DISPLAY: NodeProps(type=NodeType.LINE_DISPLAY, name='Line Display', tags=['output'], description='Displays data as 1d plots', detail=NodeDetail.LINE_DISPLAY, input=['In']),
    NodeType.LAYER_DISPLAY: NodeProps(type=NodeType.LAYER_DISPLAY, name='Layer Display', tags=['output'], description='Displays data as an image', detail=NodeDetail.LAYER_DISPLAY, input=['Layer 1', 'Layer 2'], fn=process_2channel_data),
    NodeType.HISTOGRAM: NodeProps(type=NodeType.HISTOGRAM, name='Histogram', tags=['output'], description='Displays data as histogram', detail=NodeDetail.HISTOGRAM, input=['In'], fn=process_historam),
    NodeType.EXPORT_FILE: NodeProps(type=NodeType.EXPORT_FILE, name='Export', tags=['export'], description='File export', detail=NodeDetail.EXPORT_FILE,input = ['data'],output=['out'], options=['file_name',{'name':'type', 'select':['All','Dicoms', 'Nifti', 'Mat']}], fn=export_data),
    # Debug Nodes
    #NodeType.DELAY: NodeProps(type=NodeType.DELAY, name='Delay', tags=['debug'], description='Creates time delay', detail=NodeDetail.DELAY, input=['In'], output=['Out'], fn=time_delay),
    #NodeType.ERROR: NodeProps(type=NodeType.ERROR, name='Error', tags=['debug'], description='Creates an error', detail=NodeDetail.ERROR, input=['In'], output=['Out'], fn=error_node),
}
