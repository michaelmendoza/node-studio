import numpy as np
from process.core.fft import *
from process.recon.SOS import complex_root_sum_of_squares

def get_sensitivity_map(Kspace_data,coilAxis = 2):
    '''
    -------------------------------------------------------------------------
    Parameters
    
    Kspace_data: array_like
    k space data

    coilAxis: int
    coil axis

    -------------------------------------------------------------------------
    Returns
    sens_map: array_like
    sensitivity maps for each coil 

    -------------------------------------------------------------------------
    References
    
    [1] 
    Author: P B Roemer et al. 
    Title: The NMR phased array
    Link: https://pubmed.ncbi.nlm.nih.gov/2266841/
    
    '''
    data = Kspace_data
    if(len(data.shape) == 4):
        data = np.reshape(data, (data.shape[1],data.shape[2],data.shape[3]))
    images = ifft2c(data)
    shape = images.shape
    sens_map = np.zeros(shape,dtype= complex)
    image = complex_root_sum_of_squares(images)
    for i in range(shape[coilAxis]):
        sens_map[:,:,i] = images[:,:,i]/image
    return sens_map