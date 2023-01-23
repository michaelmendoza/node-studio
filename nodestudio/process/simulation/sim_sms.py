
import numpy as np
from nodestudio.process.core.fft import *
from nodestudio.core.dataset import NodeDataset
from nodestudio.core.datagroup import DataGroup
from nodestudio.core.metadata import NodeMetadata
from nodestudio.process.recon.SOS import *
from nodestudio.process.core.mask import * 


def sms_simulator(dataset, type):


    if dataset.tag != "kspace":
        dataset.data = fft2c(dataset.data)
    
    if type == "CAIPI": 
        data = dataset.data
        ns, ny, nx, nc = data.shape
        data = np.moveaxis(data, 0, -1)

        rawData = np.zeros(rawImage.shape, dtype = complex)
        rawData = fft2c(rawImage, (0, 1)) # create a duplicate 
        rawImage = ifft2c(data, (0,1))

        cycle = np.arange(0,1,1/ns) * 2* np.pi
        numAccq = int(ns * ny)    
        shift = cycle*numAccq/(2*np.pi)
        data = multiSliceCAIPI(rawImage, cycle, R = 1)
        acsshift = cycle*int(ns* 32)/(2*np.pi)
        acsK = acs(rawData, (32, 32))
        acsIm = ifft2c(acsK)
        calib = fft2c(singleSliceFov(acsIm,acsshift))

        data = np.moveaxis(data, -1, 0)
        calib = np.moveaxis(calib, -1, 0)
    if type == "NO_CAIPI": 
        data = dataset.data
        ns, ny, nx, nc = data.shape
        data = np.moveaxis(data, 0, -1)

        rawData = np.zeros(rawImage.shape, dtype = complex)
        rawData = fft2c(rawImage, (0, 1)) # create a duplicate 
        rawImage = ifft2c(data, (0,1))

        data = np.sum(rawData, -1)
        calib = acs(rawData, (32, 32))

        data = np.moveaxis(data, -1, 0)
        calib = np.moveaxis(calib, -1, 0)


    dataset.data = dataset.data
       
    metadata = NodeMetadata("phantom", "phantom")
    reference = NodeDataset(calib, metadata , ["Sli", "Lin", "Col", "Cha"], tag = 'kspace')
    datagroup = DataGroup({"DATA": dataset, "SLICE_ACCEL_REFSCAN": reference})
    return datagroup







# k space based, thus using cycle in rads 
# sadly you still need to transform into image space then apply the phase shift
def multiSliceCAIPI(im, cycle,  R): 
    ny, nx, nc, ns = im.shape
    lin = int(ns*ny/R)
    imgLargeFov = np.tile(np.zeros(im.shape, dtype = complex), [ns, 1, 1, 1])
    imgLargeFov[int(ns*ny/2-ny/2):int(ns*ny/2+ny/2),:,:] = im
    dataLargeFov = fft1c(imgLargeFov, 0)
    dataLargeFov = dataLargeFov[::R]
    data = np.zeros([lin, nx , nc], dtype = complex)
    for readout in range (lin):
        for n in range (ns):
            data[readout,:] += dataLargeFov[readout,:,:,n]*np.exp(-1j*readout*cycle[n])
    return ifft1c(data, 0)

# image domain based, thus using shift in pixels
def multiSliceFov(im, shift):
    ny, nx, nc, ns = im.shape
    imLarge = np.zeros([ns*ny, nx, nc], dtype = complex)
    for sli in range (ns):
        imLarge[int(sli*ny):int((sli+1)*ny),:,:] = np.roll(im[:,:,:,sli],int(shift[sli]), axis=0)
    imLarge = np.roll(imLarge, int((ns*ny-ny)/2), axis = 0)
    return imLarge


def singleSliceFov(im, shift):
    _, _, _, ns = im.shape
    for sli in range (ns):
        im[:,:,:,sli] = np.roll(im[:,:,:,sli],int(shift[sli]), axis=0)
    return im

def acs(rawKspace,acsShape):
    ny, nx = rawKspace.shape[:2]
    [cny, cnx] = acsShape
    idxx = int(np.floor((nx - cnx)/2))
    idxy = int(np.floor((ny - cny)/2))
    # print("patch taken from "+str(idxy)+" : "+ str(idxy+cny)+" in y")
    # print("patch taken from "+str(idxx)+" : "+ str(idxx+cnx)+" in x")
    ACS = rawKspace[idxy:idxy+cny, idxx:idxx+cnx,...]
    return ACS

