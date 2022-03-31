import numpy as np

def undersample(data, undersampling_ratio, height= 5, width = 4):
    [phase, frequency, coil] = data.shape
    mask = np.zeros([phase, frequency, coil])
    ACS = 2 * undersampling_ratio*(height-1)  # assume the minimum
    start = np.floor((phase - ACS)/2)
    end = start + ACS
    for i in range(phase):
        if (i >= start) and (i < end):
            mask[i, :, :] = 1  # middle region
        if (i % undersampling_ratio == 1):
            mask[i, :, :] = 1  # outside region
    data_R = data * mask
        
    return data_R