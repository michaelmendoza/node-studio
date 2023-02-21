import numpy as np
from process.core.fft import *
from core.dataset import NodeDataset
from core.datagroup import DataGroup
from core.metadata import NodeMetadata
from process.recon.SOS import *
from process.core.mask import * 
import process.core.sms_sim as sms
def acs(rawKspace,acsShape):
    ny, nx = rawKspace.shape[1:3]
    [cny, cnx] = acsShape
    idxx = int(np.floor((nx - cnx)/2))
    idxy = int(np.floor((ny - cny)/2))
    print(rawKspace.shape)
    ACS = rawKspace[:,idxy:idxy+cny, idxx:idxx+cnx,...]
    return ACS

def var_den_mask(shape, R):
    start = 1e-7
    end = 0.1
    for i in range(20):    
        cur = (start + end)/2
        mask = var_dens_mask(shape, cur)
        curR = undersampling_rate(mask)
        if curR < 1/R: 
            end = (start + end) /2
        else: 
            start = (start + end) /2
    return mask

def undersample(dataset, type, undersampling_ratio):
    if dataset.tag != "kspace":
        data = fft2c(dataset.data, (1, 2))
    else:
        data = dataset.data

    if type == "GRAPPA": 
        undersampling_ratio = int(undersampling_ratio)    
        mask = np.zeros(dataset.shape)
        mask[:,::undersampling_ratio,...] = 1
        ref = acs(data,(32,32))
        data = data * mask

    if type == "SENSE":
        ref = acs(data,(32,32))
        undersampling_ratio = int(undersampling_ratio)    
        mask = np.zeros(dataset.shape)
        mask[:,::undersampling_ratio,...] = 1
        data = data * mask
        # ref = inati_cmap(ifft2c(data))

    if type == "SMS_CAIPI":
        
        acs_data = acs(data, (32, 32))
        data =  np.moveaxis(data, 0, -1)
        acs_data =  np.moveaxis(acs_data, 0, -1)

        ny, nx, nc, ns = data.shape
        R = ns
        cycle = np.arange(0,1,1/ns) * 2* np.pi
        numAccq = int(ns*ny/R)
        shift = cycle*numAccq/(2*np.pi)
        data = fft2c(sms.multiSliceCAIPI(ifft2c(data, (0,1)), cycle, R), (0,1))
        acsshift = cycle*int(ns* 32 /R)/(2*np.pi)
        acsIm = ifft2c(acs_data, (0,1))
        ref = fft2c(sms.singleSliceFov(acsIm,acsshift), (0,1))
        ref = np.moveaxis(ref, -1, 0)
        data = data[None,...]

    if type == "Variable Density":
        ns, ny, nx, nc = dataset.data.shape
        # i need to think about this. 
        mask = var_den_mask([ny, nx], int(undersampling_ratio)) 
        mask = np.tile(mask.reshape(1, ny,nx, 1), (ns, 1,1, nc))
        ref = inati_cmap(ifft2c(data))
        data = data * mask
        

    metadata = NodeMetadata("phantom", "phantom")
    ds = NodeDataset(data, metadata, dataset.dims, 'kspace')
    reference = NodeDataset(ref, metadata , ["Sli", "Lin", "Col", "Cha"], tag = 'kspace')
    datagroup = DataGroup({"data": ds, "ref": reference})
    return datagroup
