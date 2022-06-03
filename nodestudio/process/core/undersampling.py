import numpy as np
from process.core.fft import *
from core.dataset import NodeDataset
from core.datagroup import DataGroup
from core.metadata import NodeMetadata

def acs(rawKspace,acsShape):
    ny, nx = rawKspace.shape[1:3]
    [cny, cnx] = acsShape
    idxx = int(np.floor((nx - cnx)/2))
    idxy = int(np.floor((ny - cny)/2))
    print(rawKspace.shape)
    ACS = rawKspace[:,idxy:idxy+cny, idxx:idxx+cnx,...]
    return ACS


def undersample(dataset, type, undersampling_ratio):
    if dataset.tag != "kspace":
        raise Exception("undersample in image domain")

    if type == "GRAPPA": 
        ref = acs(dataset.data,(32,32))
    #if type == "SENSE":
         # skip no idea what raw data looks like 
        
    undersampling_ratio = int(undersampling_ratio)    
    mask = np.zeros(dataset.shape)
    mask[:,::undersampling_ratio,...] = 1
    dataset.data = dataset.data * mask
       
    metadata = NodeMetadata("phantom", "phantom")
    reference = NodeDataset(ref, metadata , ["Sli", "Lin", "Col", "Cha"], tag = 'image')
    datagroup = DataGroup({"rawdata": dataset, "reference": reference})
    return datagroup