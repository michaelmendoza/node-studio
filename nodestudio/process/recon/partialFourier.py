import numpy as np
from process.core.fft import *
from process.recon.SOS import * 
from process.recon.zpad import * 
def conjugateSynthesis(dataR, calib):
    idx = np.where(np.sum(np.abs(dataR), axis=1)==0)[0]
    cphs = np.exp(-1j*np.angle(ifft2c(calib, (0,1))))
    im = np.zeros(dataR.shape, dtype = complex)
    imR =  ifft2c(dataR, (0,1)) * cphs
    dataR = fft2c(imR, (0,1))
    dataR[idx[0]:,:] = np.flip(np.flip(np.conj(dataR[len(idx):0:-1,:]),0),1)
    return ifft2c(dataR, (0,1))

def pocs(dataR, calib):
    idx = np.where(np.sum(np.abs(dataR), axis=1)==0)[0]
    phs = np.exp(1j*np.angle(ifft2c(calib, (0,1))))
    im = np.zeros(dataR.shape, dtype = complex)
    for n in range(5):
        tmp = im*phs
        tmp = fft2c(tmp, (0,1))
        tmp[:idx[0],:] = dataR[:idx[0],:] 
        tmp = ifft2c(tmp, (0,1))*np.conj(phs)
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
    phs = np.exp(1j*np.angle(ifft2c(calib, (0,1))))
    im = np.conj(phs)*ifft2c(dataR*kern, (0,1))
    im[im < 0] = 0
    return im


def partialFourierRecon(data, ref, type):
    dataRset = data.data
    calibset = ref.data
    reconset = NodeDataset(None, data.metadata, data.dims[:3], "image")
    for sli in range(dataRset.shape[0]):
        data = pf( dataRset[sli,...],ref[sli,...], type)
        if reconset.data == None: 
            reconset.data = data
        else: 
            reconset.data = np.concatenate((reconset.data, data), axis = 0)
    return reconset

def pf(data, calib, type):
    ny, nx, nc = data.shape
    calib = zpad(calib, (ny, nx), (0,1))
    recon = np.zeros(data.shape, dtype = complex)
    for c in range(nc):
        if type == "Conjugate Synthesis":
            recon[...,c] = conjugateSynthesis(data[...,c], calib[...,c])
        if type == "POCS":
            recon[...,c] = pocs(data[...,c], calib[...,c])
        if type == "Homodyne":
            recon[...,c] = homodyne(data[...,c], calib[...,c])
    return rsos(ifft2c(data,(0,1)), 2)
