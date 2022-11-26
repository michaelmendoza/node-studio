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
        dataset.data = fft2c(dataset.data, axis = (1,2))
    ACS = []
    if type == "GRAPPA/SENSE": 
        ACS = acs(dataset.data,(32,32))

        
    undersampling_ratio = int(undersampling_ratio)    
    mask = np.zeros(dataset.shape)
    mask[:,::undersampling_ratio,...] = 1
    dataset.data = dataset.data * mask
       
    metadata = NodeMetadata("phantom", "phantom")
    reference = NodeDataset(ACS, metadata , ["Sli", "Lin", "Col", "Cha"], tag = 'kspace')
    datagroup = DataGroup({"rawdata": dataset, "reference": reference})
    return datagroup
