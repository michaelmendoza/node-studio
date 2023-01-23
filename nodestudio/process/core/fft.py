import numpy as np
from core.dataset import NodeDataset

def ifft2c(dataset, axis = (1,2)):
    '''
    -------------------------------------------------------------------------
    Parameters
    
    F: array_like
    k space data 

    -------------------------------------------------------------------------
    Returns
    f : array-like
    image
    '''
    x,y = (axis)
    tmp0 = np.fft.ifftshift(np.fft.ifftshift(dataset, axes=(x,)), axes=(y,))
    tmp1 = np.fft.ifft(np.fft.ifft(tmp0, axis = x), axis = y)
    f = np.fft.fftshift(np.fft.fftshift(tmp1, axes=(x,)), axes=(y,))
    result = f * np.sqrt(dataset.shape[x]* dataset.shape[y])   
    return result

def fft2c(dataset, axis = (1,2)):
    '''
    -------------------------------------------------------------------------
    Parameters
    
    f: array_like
    image

    -------------------------------------------------------------------------
    Returns

    F : array-like
    k space data
    '''
    x,y = (axis)
    tmp0 = np.fft.fftshift(np.fft.fftshift(dataset, axes=(x,)), axes=(y,))
    tmp1 = np.fft.fft(np.fft.fft(tmp0, axis = x), axis = y)
    F = np.fft.ifftshift(np.fft.ifftshift(tmp1, axes=(x,)), axes=(y,))
    result = F / np.sqrt(dataset.shape[x]* dataset.shape[y]) 
    return result 

def fft(dataset, type):
    '''
    -------------------------------------------------------------------------
    Parameters
    
    f: array_like
    data 

    type: string
    type of fourier transform
    -------------------------------------------------------------------------

    Returns
    F : array-like
    processed data 
    '''
    if type == "ifft":
        return ifft2c(dataset)
    else:
        return fft2c(dataset)


def ifft1c(F, axis = (0)):
    x = (axis)
    tmp0 = np.fft.ifftshift(F, axes=(x,))
    tmp1 = np.fft.ifft(tmp0, axis = x)
    f = np.fft.fftshift(tmp1, axes=(x,))
    return f * F.shape[x]

def fft1c(f, axis = (0)):
    x = (axis)
    tmp0 = np.fft.fftshift(f, axes=(x,))
    tmp1 = np.fft.fft(tmp0, axis = x)
    F = np.fft.ifftshift(tmp1, axes=(x,))
    return F / f.shape[x]