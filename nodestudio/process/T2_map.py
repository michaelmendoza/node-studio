import os 
from matplotlib import pyplot as plt
import numpy as np
from pathlib import Path
import pydicom as dcm
import math
from numpy import sqrt, sin, cos, pi, exp, log
from ipywidgets import interact, interactive, fixed, interact_manual
import ipywidgets as widgets

#change hard coded tissue T1, create db of T1 lookup table
def qDESS_T2(filePath, spl_dur, GlArea, tissue, **kwargs):
    
    '''
    -------------------------------------------------------------------------
    Parameters
    
    filePath: string  
    filepath of the dicom images used for T2 mapping
    
    spl_dur: s 
    Flip or tip angle of the magnetization vector 
    
    spl_area: mT/(ms) 
    Angle between the vector and x axis/ phase
    
    tissue: string 
    Type of tissue, like bones, CSF, fat.
    
    Optional parameters: 
    
    T1: s
    estimated T1 value of the tissue
    
    D: m^2/s
    estimate for the diffusivity of the tissue
    
    -------------------------------------------------------------------------
    Returns
    images : array like
    images of the dicom files under the given dir
    
    t2map : array like 
    t2 map for the dicom files
    
    -------------------------------------------------------------------------
    Notes
    
    user can estimate T1 and diffusivity of the tissue for better results or the function can accept more images for better mapping
    
    -------------------------------------------------------------------------
    References
    
    [1] 
    Author: B Sveinsson et al. 
    Title: A Simple Analytic Method for Estimating T2 in the Knee from DESS
    Link: https://www.ncbi.nlm.nih.gov/pubmed/28017730
    
    '''
    
    data = Path(filePath)
    dirs = list(data.glob('**/*.IMA'))
    
    file0 = dcm.read_file(dirs[0]) 
    f = file0.pixel_array
    [height, width] = f.shape
    N = len(dirs)

    #could store matter infor in a table to check otherwise read the estimated from user 
    tissue = kwargs.get('tissue', 'sciatic nerve')
    #if sciatic nerver.... use dict, objects etc. 
    
    T1 = kwargs.get('T1', 1.2)
    D = kwargs.get('D', 1.25e-9)
    TR = file0.RepetitionTime*1e-3
    TE = file0.EchoTime*1e-3
    alpha = file0.FlipAngle
    Gl = GlArea/(spl_dur*1e6)*100
    gamma = 4258*2*np.pi
    dkL = gamma*Gl*spl_dur
    sind = (math.sin(math.radians(alpha/2)))
    k = ((math.sin(math.radians(alpha/2))))**2*((1 + exp(-TR/T1 - TR*dkL**2*D)))/(1 - (math.cos(math.radians(alpha)))*exp(-TR/T1 - TR*dkL**2*D))
    c1 = (TR-spl_dur/3)*dkL**2*D
    del file0
    del f
    images = np.zeros([height,width,N])
    for index,f in enumerate (dirs):
        image = dcm.read_file(f).pixel_array
        images[:,:,index] = image
    dess = np.zeros([height,width,int(N/2),2])
    dess[:,:,:,0] = images[:,:,0:int(N/2)]
    dess[:,:,:,1] = images[:,:,int(N/2):]
    mask = np.ones([height,width,int(N/2)])
    ratio = np.zeros([height, width, int(N/2)])
    ratio = mask*dess[:,:,:,1]/dess[:,:,:,0]
    t2map = (-2000*(TR-TE)/(log(abs(ratio)/k)+c1))
    return t2map, images

