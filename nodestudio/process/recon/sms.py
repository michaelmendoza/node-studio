import numpy as np
from process.core.fft import *
import math
from scipy.linalg import pinv
from core.datagroup import DataGroup
from core.dataset import NodeDataset 
from process.recon.SOS import * 
from process.recon.sg import sg

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

    if type == "sg":
        recon = sg(dataR, calib)
    


    recon = np.moveaxis(recon, -1, 0)
    return rsos(recon)