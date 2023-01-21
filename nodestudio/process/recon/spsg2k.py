import numpy as np
import math



def spsg2k(dataR, calib, kh = 5, kw = 5):
    [ny, nx, nc] = dataR.shape
    [cny, cnx, _, ns] = calib.shape
    data = np.zeros([ny, nx, nc, ns], dtype = complex)
    data[::2] = spsg(dataR, calib, kh, kw, start = 0)
    data[1::2] = spsg(dataR, calib, kh, kw, start = 1)
    return data

def spsg(dataR, calib, kh, kw, start = 0):
    [ny, nx, nc] = dataR.shape
    [cny, cnx, _, ns] = calib.shape
    ks = kh  * kw  * nc
    if ny % 2: 
        if start: 
            hny =math.floor(ny/2)
        else: 
            hny = math.ceil(ny/2) 
    else:
        hny = ny // 2
    if cny % 2: 
        if start: 
            nt = math.floor(cny/2) * cnx
        else: 
            nt = math.ceil(cny/2) * cnx
    else: 
        nt = int(cny * cnx/2)
    data = np.zeros([hny, nx, nc, ns], dtype = complex)
    Ms = np.zeros([nt,ks,ns], dtype = complex)
    M = np.zeros([ks,ks], dtype = complex)
    for sli in range(ns):
        Ms[...,sli] = patches(calib[...,sli], kh, kw, start)
        M += Ms[...,sli].conj().T@Ms[...,sli]
    M = np.linalg.pinv(M)
    inMat = patches(dataR,kh, kw,start)
    for sli in range(ns):
        I = calib[start::2,...,sli].reshape(-1,nc)
        MI = Ms[...,sli].conj().T@I
        w = M@MI
        data[...,sli] = (inMat @ w).reshape(hny, nx, nc)
    return data

def patches(mat, kh, kw, start):
    [h, w, coil] = mat.shape
    if h % 2: 
        if start: 
            nt = math.floor(h/2) * w 
        else: 
            nt = math.ceil(h/2) * w
    else: 
        nt = int(h * w/2)
    kSize = kh * kw * coil
    inMatrix = np.zeros([nt, kSize], dtype = complex)
    num = 0
    for y in range (start, h, 2):
        ys = np.mod(np.linspace(y - int((kh/2-1)+ 1), y+int((kh/2)), kh, dtype = int), h)
        for x in range(w):
            xs = np.mod(np.linspace(x - int((kw/2-1) + 1), x+int((kw/2)), kw, dtype = int), w)
            inMatrix[num,:] = mat[ys][:,xs][:,:,:].reshape(1,-1)
            num = num + 1
    return inMatrix