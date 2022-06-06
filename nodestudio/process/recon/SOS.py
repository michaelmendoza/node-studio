import numpy as np

from process.core.fft import *

def sum_of_squares(a,b):
    if isinstance(a, np.ndarray) & isinstance(b, np.ndarray):
        result = a**2+b**2
        
        return result

def complex_root_sum_of_squares(input):
    result= np.sqrt(np.sum((input*1j*input), axis=2))
    return result

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