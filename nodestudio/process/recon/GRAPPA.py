import numpy as np
from process.core.fft import *
import math
from scipy.linalg import pinv
from core.datagroup import DataGroup
from core.dataset import NodeDataset 
from process.recon.SOS import * 
def grappa(datagroup):
    if len(datagroup.group) % 2: 
        raise Exception("data group should be mutliple of 2 for reconstruction")
    datakey = list(datagroup.group.keys())[0]
    refkey = list(datagroup.group.keys())[1]
    dataRset = datagroup[datakey].data
    calibset = datagroup[refkey].data
    reconset = NodeDataset(None, datagroup[datakey].metadata, datagroup[datakey].dims, "image")
    for sli in range(dataRset.shape[0]):
        data = recon( dataRset[sli,...], calibset[sli,...])
        if reconset.data == None: 
            reconset.data = data
        else: 
            reconset.data = np.concatenate((reconset.data, data), axis = 0)
    return reconset
   
def recon(dataR, calib, kh = 2, kw = 3):
    calib = np.moveaxis(calib, -1, 0) # move the coil to the front -> fft in the axis 3 and 4
    dataR = np.moveaxis(dataR, -1, 0)
    [nc, ny, nx] = dataR.shape
    idx = np.where(np.sum(np.abs(dataR[0,:,:]), axis=1)==0)[0]
    R = int(np.round(ny/len(idx)))
    [_, ncy, ncx] = calib.shape
    ks = nc*kh*kw
    nt = (ncy-(kh-1)*R)*(ncx-(kw-1))
    inMat=np.zeros([ks,nt], dtype = complex)
    outMat=np.zeros([nc*R,nt], dtype = complex)
    n = 0
    for x in ((np.arange(np.floor(kw/2),ncx-np.floor(kw/2), dtype=int))):
        for y in (np.arange(ncy-(kh-1)*R)):
            inMat[...,n] = calib[:,y:y+kh*R:R, int(x-np.floor(kw/2)):int(x+np.floor(kw/2))+1].reshape(1,-1)
            outMat[...,n] = calib[:,int(y+np.floor((R*(kh-1)+1)/2) - np.floor(R/2)):int(y+np.floor((R*(kh-1)+1)/2)-np.floor(R/2)+R),x].reshape(1,-1)
            n = n + 1  
    w =  outMat@pinv(inMat, 1E-4)
    data = np.zeros([nc,ny,nx], dtype = complex)
    data = dataR
    for x in range(nx):
        xs = get_circ_xidx(x, kw, nx)
        for y in range (0,ny,R):
            ys = np.mod(np.linspace(y, y+kh*R/2, kh, dtype = int), ny)
            yf = np.arange(y,y+R)
            kernel = data[:,ys][:,:,xs].reshape(-1,1)
            data[:,yf, x] = np.matmul(w, kernel).reshape(nc,R)
    data = np.moveaxis(data, 0, -1)
    return rsos(ifft2c(data))

def get_circ_xidx(x, kw, nx):
    return np.mod(np.linspace(x-np.floor(kw/2), x+np.floor(kw/2), kw,dtype = int),nx)
def get_circ_yidx(ys, R, kh, ny):
    return np.mod(np.linspace(ys[int(kh/2)-1]+1, ys[int(kh/2)]-1, R-1, dtype = int),ny)
 


import numpy as np


def conjugate(data):
    return fft2c(np.conj(ifft2c(data)))

def vc_grappa(dataR, calib, R, kh = 4, kw = 5):
    kspace = dataR
    vc_kspace = conjugate(kspace)
    vc_calib = conjugate(calib)
    kspace = np.concatenate((kspace, vc_kspace), axis=-1)
    calib = np.concatenate((calib, vc_calib), axis=-1)
    recon = grappa(kspace, calib, R, kh, kw)
    return recon 