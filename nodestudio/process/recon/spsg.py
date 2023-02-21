import numpy as np
from tqdm.notebook import tqdm

def spsg(dataR, calib,R = 1, kh = 5, kw = 5):
    [ny, nx, nc] = dataR.shape
    [cny, cnx, _, ns] = calib.shape
    ks = kh  * kw  * nc
    nt = cny * cnx
    data = np.zeros([ny, nx, nc, ns], dtype = complex)
    Ms = np.zeros([nt,ks,ns], dtype = complex)
    M = np.zeros([ks,ks], dtype = complex)
    for sli in range(ns):
        Ms[...,sli] = patches(calib[...,sli], kh, kw)
        M += Ms[...,sli].conj().T@Ms[...,sli]
    M = np.linalg.pinv(M)
    inMat = patches(dataR,kh, kw)
    for sli in (range(ns)):
        I = calib[...,sli].reshape(-1,nc)
        MI = Ms[...,sli].conj().T@I
        w = M@MI
        data[...,sli] = (inMat @ w).reshape(ny, nx, nc)
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


