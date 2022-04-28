import numpy as np
from process.fft import *

def cgSolver(Kspace_data, sensitivity_map, numIter = 100):
    dataR = Kspace_data
    sensMap = sensitivity_map
    mask = dataR.any(axis=2)
    imagesR = ifft2c(dataR)
    [height, width, coil] = imagesR.shape
    mask = np.repeat(mask[:, :, np.newaxis], coil, axis=2)
    sconj = np.conj(sensMap)
    B = np.sum(imagesR*sconj,axis = 2)
    B = B.flatten()
    x = 0*B
    r = B 
    d = r 
    for j in range(int(numIter)):
        Ad = np.zeros([height,width],dtype = complex)
        for i in range(coil):  
            Ad += ifft2c(fft2c(d.reshape([height,width])*sensMap[:,:,i])*mask[:,:,i])*sconj[:,:,i] 
        Ad = Ad.flatten()
        a = np.dot(r,r)/(np.dot(d,Ad))
        x = x + a*d
        rn = r - a*Ad
        beta = np.dot(rn,rn)/np.dot(r,r)
        r=rn
        d = r + beta*d
    return x.reshape([height,width])