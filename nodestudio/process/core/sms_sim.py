import numpy as np
from process.core.fft import *

# k space based, thus using cycle in rads 
# sadly you still need to transform into image space then apply the phase shift
def multiSliceCAIPI(im, cycle,  R): 
    ny, nx, nc, ns = im.shape
    lin = int(ns*ny/R)
    imgLargeFov = np.tile(np.zeros(im.shape, dtype = complex), [ns, 1, 1, 1])
    imgLargeFov[int(ns*ny/2-ny/2):int(ns*ny/2+ny/2),:,:] = im
    dataLargeFov = fft1c(imgLargeFov, 0)
    dataLargeFov = dataLargeFov[::R]
    data = np.zeros([lin, nx , nc], dtype = complex)
    for readout in range (lin):
        for n in range (ns):
            data[readout,:] += dataLargeFov[readout,:,:,n]*np.exp(-1j*readout*cycle[n])
    return ifft1c(data, 0)

# image domain based, thus using shift in pixels
def multiSliceFov(im, shift):
    ny, nx, nc, ns = im.shape
    imLarge = np.zeros([ns*ny, nx, nc], dtype = complex)
    for sli in range (ns):
        imLarge[int(sli*ny):int((sli+1)*ny),:,:] = np.roll(im[:,:,:,sli],int(shift[sli]), axis=0)
    imLarge = np.roll(imLarge, int((ns*ny-ny)/2), axis = 0)
    return imLarge


def singleSliceFov(im, shift):
    _, _, _, ns = im.shape
    for sli in range (ns):
        im[:,:,:,sli] = np.roll(im[:,:,:,sli],int(shift[sli]), axis=0)
    return im


