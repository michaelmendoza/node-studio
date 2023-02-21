import numpy as np
import math   

        
def sg2k(dataR, calib,R = 1, kh =3, kw =3):
    R = R
    kh = kh
    kw = kw
    dataR = dataR
    [read, freq, numCoil] = dataR.shape
    [acsHeight, acsWidth, _, numSlice] = calib.shape
    kernSize = kh  * kw  * numCoil
    numTrain = acsHeight * acsWidth
    data = np.zeros([read, freq, numCoil, numSlice], dtype = complex)
    inmat = np.sum(calib, axis=-1)
    for sli in range(numSlice):
        data[...,sli] = fill(data[...,sli], inmat, calib[...,sli], dataR, kh, kw, start = 0)     
        data[...,sli] = fill(data[...,sli], inmat, calib[...,sli], dataR, kh, kw, start = 1)   
    return data  


def fill(data, inmat, calib, dataR, kh, kw, start = 0):
    [read, freq, numCoil] = data.shape
    [h, w, nc] = inmat.shape
    ks = kh * kw * nc
    if h % 2: 
        if start: 
            nt = math.floor(h/2) * w 
        else: 
            nt = math.ceil(h/2) * w
    else: 
        nt = int(h * w/2)
        
    inMatrix = np.zeros([nt, ks], dtype = complex)
    outMatrix = np.zeros([nt, nc], dtype = complex)
    num = 0
    for y in range (start,h,2):
        ys = np.mod(np.linspace(y - int((kh/2-1)+ 1), y+int((kh/2)), kh, dtype = int), h)
        for x in range(w):
            xs = np.mod(np.linspace(x - int((kw/2-1) + 1), x+int((kw/2)), kw, dtype = int), w)
            inMatrix[num,:] = inmat[ys][:,xs][:,:,:].reshape(1,-1)
            xc = np.take(xs, xs.size // 2)
            yc = np.take(ys, ys.size // 2)
            outMatrix[num,:] = calib[yc, xc,:]
            num = num + 1
    weight = np.linalg.pinv(inMatrix)@outMatrix
    del inMatrix, outMatrix 
    for y in range (start,read,2):
        ys = np.mod(np.linspace(y - int((kh/2-1)+ 1), y+int((kh/2)), kh, dtype = int), read)
        for x in range(freq):
            xs = np.mod(np.linspace(x - int((kw/2-1) + 1), x+int((kw/2)), kw, dtype = int), freq)
            xc = np.take(xs, xs.size // 2)
            yc = np.take(ys, ys.size // 2)
            inMatrix = dataR[ys][:,xs][:,:,:].reshape(1,-1)
            data[yc, xc, :] = (inMatrix @ weight).reshape(1, 1, numCoil)
    return data