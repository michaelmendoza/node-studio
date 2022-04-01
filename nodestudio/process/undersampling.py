import numpy as np

def undersample(data, type, undersampling_ratio, height= 5):
    undersampling_ratio = int(undersampling_ratio)
    if(type=='GRAPPA'):
        if(len(data.shape) == 4):
            data = np.reshape(data, (data.shape[1],data.shape[2],data.shape[3]))
        [phase, frequency, coil] = data.shape
        mask = np.zeros([phase, frequency, coil])
        ACS = 2 * undersampling_ratio *(height-1)  # assume the minimum
        start = np.floor((phase - ACS)/2)
        end = start + ACS
        for i in range(phase):
            if (i >= start) and (i < end):
                mask[i, :, :] = 1  # middle region
            if (i % undersampling_ratio == 1):
                mask[i, :, :] = 1  # outside region
        images = np.zeros(data.shape, dtype=complex)
        data_R = data * mask

        for i in range(coil):
            images[:, :, i] = np.fft.fftshift(
                np.fft.ifft2(np.fft.ifftshift(data_R[:, :, i])))
            
        return data_R