import numpy as np
from process.core.fft import *

def rsos(images,coilaxis = 3):
    image = np.sqrt(np.sum((images*1j*images),axis = coilaxis))
    return image

def cmap(images, coilAxis = 3):
    shape = images.shape
    cmap = np.zeros(shape,dtype= complex)
    for i in range(shape[coilAxis]):
        cmap[:,:,i] = images[:,:,i]/rsos(images)
    cmap[cmap == np.nan] = 0 
    cmap[cmap ==np.inf] = 0
    return cmap