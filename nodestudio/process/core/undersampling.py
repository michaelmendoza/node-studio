import numpy as np
from process.core.fft import *
from core.dataset import NodeDataset
from core.datagroup import DataGroup
from core.metadata import NodeMetadata
from process.recon.SOS import *
from process.core.mask import * 
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
        dataset.data = fft2c(dataset.data)

    if type == "GRAPPA": 
        undersampling_ratio = int(undersampling_ratio)    
        mask = np.zeros(dataset.shape)
        mask[:,::undersampling_ratio,...] = 1
        ref = acs(dataset.data,(32,32))

    if type == "SENSE":
        undersampling_ratio = int(undersampling_ratio)    
        mask = np.zeros(dataset.shape)
        mask[:,::undersampling_ratio,...] = 1
        ref = inati_cmap(ifft2c(dataset.data))

    if type == "Variable Density":
        ns, ny, nx, nc = dataset.data.shape
        mask = var_dens_mask([ny, nx], 0.001)
        mask = np.tile(mask.reshape(1, ny,nx, 1), (ns, 1,1, nc))
        ref = inati_cmap(ifft2c(dataset.data))
         

    dataset.data = dataset.data * mask
       
    metadata = NodeMetadata("phantom", "phantom")
    reference = NodeDataset(ref, metadata , ["Sli", "Lin", "Col", "Cha"], tag = 'image')
    datagroup = DataGroup({"rawdata": dataset, "reference": reference})
    return datagroup
