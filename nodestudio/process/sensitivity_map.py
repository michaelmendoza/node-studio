import numpy as np
from process.SOS import complex_root_sum_of_squares

def coilImages(data, coilaxis = 2):
    shape = data.shape
    images = np.zeros(shape,dtype= complex)
    for i in range(shape[coilaxis]):
        images[:,:,i] = np.fft.fftshift(np.fft.ifft2(np.fft.ifftshift(data[:,:,i])))
    return images

def get_sensitivity_map(data, coilAxis = 2):
    if(len(data.shape) == 4):
        data = np.reshape(data, (data.shape[1],data.shape[2],data.shape[3]))
    images = coilImages(data)
    shape = images.shape
    sens_map = np.zeros(shape,dtype= complex)
    image = complex_root_sum_of_squares(images)
    for i in range(shape[coilAxis]):
        sens_map[:,:,i] = images[:,:,i]/image
    return sens_map