import numpy as np
from process.fft import *

def undersample(data, type, undersampling_ratio, height= 5):
    undersampling_ratio = int(undersampling_ratio)
    if(len(data.shape) == 4):
        data = np.reshape(data, (data.shape[1],data.shape[2],data.shape[3]))
    if(type=='GRAPPA'):
        [phase, frequency, coil] = data.shape
        mask = np.zeros([phase, frequency, coil], dtype = complex)
        ACS = 2 * undersampling_ratio *(height-1)  # assume the minimum
        start = np.floor((phase - ACS)/2)
        end = start + ACS
        for i in range(phase):
            if (i >= start) and (i < end):
                mask[i, :, :] = 1  # middle region
            if (i % undersampling_ratio == 1):
                mask[i, :, :] = 1  # outside region
        data_R = data * mask
        return data_R

    elif (type=='SENSE'):
        [fovHeight, fovWidth, numCoil] = data.shape
        mask = np.zeros([fovHeight, fovWidth, numCoil])
        mask[::undersampling_ratio,:,:] = 1
        dataR = data * mask

        
        return dataR,undersampling_ratio