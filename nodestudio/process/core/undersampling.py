import numpy as np
from nodestudio.process.core.fft import fft1c, ifft1c, ifft2c, fft2c
from nodestudio.core.dataset import NodeDataset
from nodestudio.core.datagroup import DataGroup
from nodestudio.core.metadata import NodeMetadata
from nodestudio.process.recon.SOS import inati_cmap
from nodestudio.process.core.mask import var_dens_mask, undersampling_rate

flags_for_undersampling = ["PATREFSCAN"]

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

def undersample(datagroup, types, undersampling_ratio):

    if type(datagroup) is not DataGroup: 
        raise Exception("Not a data group")

    keys = datagroup.keys()
    if "DATA" not in keys:
        raise Exception("No data availble for the operation")
    
    if any(i in keys for i in flags_for_undersampling) == True:
        raise Exception("Already undersampled")

    dataset = datagroup["DATA"]

    if dataset.tag == "image":
        print("currently in image space, convert to kspace")
        dataset.data = fft2c(dataset.data, (1,2))
        dataset.tag = "kspace"

    if types == "GRAPPA" or type == "SENSE": 
        undersampling_ratio = int(undersampling_ratio)    
        mask = np.zeros(dataset.shape)
        mask[:,::undersampling_ratio,...] = 1
        ref = acs(dataset.data,(32,32))


    if types == "Variable Density":
        ns, ny, nx, nc = dataset.data.shape
        # i need to think about this. 
        mask = var_den_mask([ny, nx], int(undersampling_ratio)    ) 
        mask = np.tile(mask.reshape(1, ny,nx, 1), (ns, 1,1, nc))
        ref = inati_cmap(ifft2c(dataset.data))
         
    
    dataset.data = dataset.data * mask
       
    metadata = NodeMetadata("phantom", "phantom")
    reference = NodeDataset(ref, metadata , ["Sli", "Lin", "Col", "Cha"], tag = 'kspace')
    datagroup = DataGroup({"DATA": dataset, "PATREFSCAN": reference})
    return datagroup
