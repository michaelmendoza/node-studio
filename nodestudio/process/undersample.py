import numpy as np

def undersample(type, data, undersampling_ratio, height= 5):
    if(type=='GRAPPA'):
        #------reshape data, HARD CODED------
        data = np.reshape(data,(256,256,32))
        #------reshape data, HARD CODED------

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
        images = np.zeros(data.shape, dtype=complex)
        data_R = data * mask

        for i in range(coil):
            images[:, :, i] = np.fft.fftshift(
                np.fft.ifft2(np.fft.ifftshift(data_R[:, :, i])))
            
        return data_R