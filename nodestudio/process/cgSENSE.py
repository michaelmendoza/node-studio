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
            # this is intuitive, the correct image is sensivity encoded, then undersampled in K space, but this took me quite a while :(
        # see equations from 45 to 49 in [4].
        Ad = Ad.flatten()
        a = np.dot(r,r)/(np.dot(d,Ad))
        '''
        This is the core idea behind steepest descent, where the new direction is orthogonal to the previous search. 
        This also very intuitive, in some sense you only maximise the information obatin in this search when it can no longer 
        improve your next search. However, this will lead to zigzag-ish path, which is highly inefficient.     
        '''
        x = x + a*d
        '''
        This corresponds to a collection of images, like layers upon layers staring from the initial guess. 
        '''
        rn = r - a*Ad
        beta = np.dot(rn,rn)/np.dot(r,r)
        r=rn
        d = r + beta*d
        '''
        This is where conjugate gradient kicks in, it uses the previous hardwork along with the current search direction. 
        As a result, this is more efficient. 
        '''
    return x.reshape([height,width])