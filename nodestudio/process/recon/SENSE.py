import numpy as np
from nodestudio.process.core.fft import fft1c, ifft1c, fft2c, ifft2c
from nodestudio.core.dataset import NodeDataset 
from nodestudio.core.datagroup import DataGroup
from nodestudio.process.recon.SOS import inati_cmap, rsos
from nodestudio.process.recon.zpad import zpad
flags_for_undersampling = ["PATREFSCAN"]

def SENSErecon(datagroup):
    if type(datagroup) is not DataGroup: 
        raise Exception("Not a data group")

    keys = datagroup.keys()
    if "DATA" not in keys:
        raise Exception("No data availble for the operation")
    
    if any(i in keys for i in flags_for_undersampling) == False:
        raise Exception("Fully sampled")
    
    dataRset = datagroup["DATA"].data
    calibset = datagroup["PATREFSCAN"].data
    reconset = NodeDataset(None, datagroup["DATA"].metadata, datagroup["DATA"].dims[:3], "image")
    for sli in range(dataRset.shape[0]):
        data = recon( dataRset[sli,...], calibset[sli,...])
        if reconset.data == None: 
            reconset.data = data
        else: 
            reconset.data = np.concatenate((reconset.data, data), axis = 0)
    datagroup = DataGroup({"DATA": reconset})
    return datagroup


def recon(dataR, acs):
    mask = np.where(dataR[:,0,0] == 0, 0, 1).flatten()
    R = int(np.ceil(mask.shape[0]/np.sum(mask)))
    [ny, nx, nc] = dataR.shape
    images = ifft2c(dataR, (0, 1))
    readny = int(ny/R)
    pat = ifft2c(zpad(acs, (ny, nx), (0,1)))
    coilmaps = inati_cmap(pat) 
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
