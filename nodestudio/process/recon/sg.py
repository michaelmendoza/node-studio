import numpy as np
import math   
  
def sg(dataR, calib, kh = 5, kw = 5, inMat = None, inMatrix = None):
    [read, freq, numCoil] = dataR.shape
    calib = calib
    [acsHeight, acsWidth, _, numSlice] = calib.shape
    kernSize = kh  * kw  * numCoil
    numTrain = acsHeight * acsWidth
    data = np.zeros([read, freq, numCoil, numSlice], dtype = complex)
    ACS = np.sum(calib, axis=-1)
    if inMat is None:
        inMat = patches(dataR,kh, kw) 
    if inMatrix is None:
        inMatrix =  patches(ACS, kh, kw)
    for sli in range(numSlice):
        outMatrix = calib[...,sli].reshape(-1,numCoil)
        w = np.linalg.pinv(inMatrix)@outMatrix
        data[...,sli] = (inMat @ w).reshape(read, freq, numCoil)
    return data


def patches(mat, kh, kw):
    [h, w, coil] = mat.shape
    kSize = kh * kw * coil
    inMatrix = np.zeros([h * w, kSize], dtype = complex)
    num = 0
    for y in range (h):
        ys = np.mod(np.linspace(y - int((kh/2-1)+ 1), y+int((kh/2)), kh, dtype = int), h)
        for x in range(w):
            xs = np.mod(np.linspace(x - int((kw/2-1) + 1), x+int((kw/2)), kw, dtype = int), w)
            inMatrix[num,:] = mat[ys][:,xs][:,:,:].reshape(1,-1)
            num = num + 1
    return inMatrix
        
def get_patches(dataR, calib, kh = 5, kw = 5):
    [read, freq, numCoil] = dataR.shape
    calib = calib
    [acsHeight, acsWidth, _, numSlice] = calib.shape
    kernSize = kh  * kw  * numCoil
    numTrain = acsHeight * acsWidth
    data = np.zeros([read, freq, numCoil, numSlice], dtype = complex)
    ACS = np.sum(calib, axis=-1)
    inMat = patches(dataR,kh, kw) 
    inMatrix =  patches(ACS, kh, kw)
    return inMat, inMatrix 