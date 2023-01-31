import numpy as np
from process.core.fft import *
import math
from scipy.linalg import pinv
from core.datagroup import DataGroup
from core.dataset import NodeDataset 
from process.recon.SOS import * 
from process.recon.sg import sg
import process.core.sms_sim as sms_sim
def sms(data, ref, type):
    dataRset = np.copy(data.data)
    calibset = ref.data
    reconset = NodeDataset(None, data.metadata, data.dims, "image")
    for sli in range(dataRset.shape[0]):
        data = sms_recon( dataRset[sli], calibset, type)
        if reconset.data == None: 
            reconset.data = data
        else: 
            reconset.data = np.concatenate((reconset.data, data), axis = 0)

    return reconset
   
def sms_recon(dataR, calib, type, kh = 2, kw = 3):
    
    calib = np.moveaxis(calib, 0, -1)

    if type == "SG_CAIPI":
        recon = ifft2c(sg(dataR, calib),(0,1))
        ny, nx, nc, ns = recon.shape
        cycle = np.arange(0,1,1/ns) * 2* np.pi
        reconshift = cycle*int(ns* ny/ns)/(2*np.pi) 
        recon = sms_sim.singleSliceFov(recon, - reconshift)
    if type == "SG":
        recon = ifft2c(sg(dataR, calib),(0,1))
    
    
    


    return rsos(np.moveaxis(recon, -1, 0))