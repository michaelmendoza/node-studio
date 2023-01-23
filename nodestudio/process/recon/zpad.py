import numpy as np

'''
--------------------------------------------------------------
padding
--------------------------------------------------------------
'''
def zpad3(x, ny=256, nx=256):
    fy = int(ny/2-x.shape[0]/2)
    fx = int(nx/2-x.shape[1]/2)
    return np.pad(x, [(fy, fy), (fx, fx), (0,0)], mode='constant')

def zpad2(x, ny=256, nx=256):
    fy = int(ny/2-x.shape[0]/2)
    fx = int(nx/2-x.shape[1]/2)
    return np.pad(x, [(fy, fy), (fx, fx)], mode='constant')

def zpad(x, dim = (256, 256), axis = (0, 1)):
    axes = [(0,0) for i in range(len(x.shape))]
    for idx, i in enumerate (axis):
        pad1 = dim[idx]//2-x.shape[i]//2
        pad2 = dim[idx]//2-x.shape[i]//2 
        pad1 += dim[idx] - pad1 - pad2 - x.shape[i]
        axes[i] = (pad1, pad2)
    return np.pad(x, axes, mode='constant')