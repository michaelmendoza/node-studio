import numpy as np
from process.core.fft import *



import numpy as np
from process.core.fft import fft1c, ifft1c, fft2c, ifft2c
from core.dataset import NodeDataset 
from core.datagroup import DataGroup
from process.recon.SOS import inati_cmap, rsos, walsh_cmap
from process.recon.zpad import zpad
flags_for_undersampling = ["PATREFSCAN"]

def cgSENSE(data, ref, numIter):
    ''' SENSE: Paralleling imaging reconstruction  '''
    '''
        if type(datagroup) is not DataGroup: 
            raise Exception("SENSE requires datagroup as input")
        
        keys = datagroup.keys()
        if "DATA" not in keys:
            raise Exception("No data availble for the operation")
        
        if any(i in keys for i in flags_for_undersampling) == False:
            raise Exception("Fully sampled")
    '''

    dataRset = data.data
    calibset = ref.data
    reconset = NodeDataset(None, data.metadata, data.dims[:3], "image")
    for sli in range(dataRset.shape[0]):
        data = cgSolver( dataRset[sli,...], calibset[0,...], numIter)
        if reconset.data == None: 
            reconset.data = data
        else: 
            reconset.data = np.concatenate((reconset.data, data), axis = 0)
    return reconset


def cgSolver(data, ref, numIter = 100):

    dataR = data
    [ny, nx, nc] = data.shape
    pat = ifft2c(zpad(ref, (ny, nx), (0,1)), (0,1))
    coilmaps = walsh_cmap(pat) 
    sensMap = coilmaps / np.max(rsos(coilmaps, -1))
    mask = dataR.any(axis=2)
    imagesR = ifft2c(dataR, (0, 1))
    mask = np.repeat(mask[:, :, np.newaxis], nc, axis=2)
    sconj = np.conj(sensMap)
    B = np.sum(imagesR*sconj,axis = 2)
    B = B.flatten()
    x = 0*B
    r = B 
    d = r 
    for j in range(int(numIter)):
        Ad = np.zeros([ny,nx],dtype = complex)
        for i in range(nc):  
            Ad += ifft2c(fft2c(d.reshape([ny,nx])*sensMap[:,:,i], (0,1))*mask[:,:,i], (0,1))*sconj[:,:,i] 
        Ad = Ad.flatten()
        a = np.dot(r,r)/(np.dot(d,Ad))
        x = x + a*d
        rn = r - a*Ad
        beta = np.dot(rn,rn)/np.dot(r,r)
        r=rn
        d = r + beta*d
    return x.reshape([ny,nx])[None,...]