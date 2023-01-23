import numpy as np
from nodestudio.process.core.fft import *
import math
from scipy.linalg import pinv
from nodestudio.core.datagroup import DataGroup
from nodestudio.core.dataset import NodeDataset 
from nodestudio.process.recon.SOS import * 
def sms_reconstruction(datagroup):
    

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
   
