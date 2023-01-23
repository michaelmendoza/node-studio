import numpy as np
from process.core.fft import *

def conjugateSynthesis(dataR, calib):
    idx = np.where(np.sum(np.abs(dataR), axis=1)==0)[0]
    cphs = np.exp(-1j*np.angle(ifft2c(calib)))
    im = np.zeros(dataR.shape, dtype = complex)
    imR =  ifft2c(dataR) * cphs
    dataR = fft2c(imR)
    dataR[idx[0]:,:] = np.flip(np.flip(np.conj(dataR[len(idx):0:-1,:]),0),1)
    return ifft2c(dataR)

def pocs(dataR, calib):
    idx = np.where(np.sum(np.abs(dataR), axis=1)==0)[0]
    phs = np.exp(1j*np.angle(ifft2c(calib)))
    im = np.zeros(dataR.shape, dtype = complex)
    for n in range(5):
        tmp = im*phs
        tmp = fft2c(tmp)
        tmp[:idx[0],:] = dataR[:idx[0],:] 
        tmp = ifft2c(tmp)*np.conj(phs)
        tmp[tmp < 0] = 0 
        im = tmp 
    return im

def homodyne(dataR, calib, kernal = "linear"):
    [ny,nx] = dataR.shape
    idx = np.where(np.sum(np.abs(dataR), axis=1)==0)[0]
    kern = np.zeros([ny,nx])
    kern[:ny-idx[0],:] = 2
    if kernal == "linear":
        kern[ny-idx[0]:idx[0],:] = np.repeat(np.linspace(2,0,2*idx[0]-ny).reshape(-1,1), nx, 1)
    if kernal == "step": 
        kern[ny-idx[0]:idx[0],:] = 1
    phs = np.exp(1j*np.angle(ifft2c(calib)))
    im = np.conj(phs)*ifft2c(dataR*kern)
    im[im < 0] = 0
    return im