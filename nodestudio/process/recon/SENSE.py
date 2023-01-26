import numpy as np
from process.core.fft import fft1c, ifft1c, fft2c, ifft2c
from core.dataset import NodeDataset 
from core.datagroup import DataGroup
from process.recon.SOS import inati_cmap, rsos, walsh_cmap
from process.recon.zpad import zpad
flags_for_undersampling = ["PATREFSCAN"]

def SENSErecon(data, ref):
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
        data = sense( dataRset[sli,...], calibset[0,...])
        if reconset.data == None: 
            reconset.data = data
        else: 
            reconset.data = np.concatenate((reconset.data, data), axis = 0)
    return reconset


def sense(dataR, acs, lamda = 1E-4):
    mask = np.where(dataR[:,0,0] == 0, 0, 1).flatten()
    R = int(np.ceil(mask.shape[0]/np.sum(mask)))
    [ny, nx, nc] = dataR.shape
    images = ifft2c(dataR,(0,1))
    readny = int(ny/R)
    pat = ifft2c(zpad(acs, (ny, nx), (0,1)), (0,1))
    coilmaps = walsh_cmap(pat) 
    coilmaps = coilmaps / np.max(rsos(coilmaps, -1))
    recon = np.zeros([ny,nx], dtype = complex)
    for x in (range(nx)):
        for y in range(readny):
            yidx = np.arange(y,ny,readny)
            S = coilmaps[yidx,x,:]
            STS = S.T @ S     
            #M = np.linalg.inv(STS+np.eye(STS.shape[0])*lamda*np.linalg.norm(STS)/STS.shape[0])@S.T 
            M = np.linalg.pinv(STS)@S.T 
            recon[yidx,x] = M.T@images[y,x,:]
    return recon[None,...]