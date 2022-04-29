import numpy as np
from process.SOS import complex_root_sum_of_squares
from process.fft import *

def get_sensitivity_map(Kspace_data,coilAxis = 2):
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