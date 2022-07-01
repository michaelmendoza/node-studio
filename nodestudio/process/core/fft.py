import numpy as np
# this deals with high dimensional data, eg. [y, x, coil, slice]

def ifft2c(F, axis = (1,2)):
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
    tmp0 = np.fft.ifftshift(np.fft.ifftshift(F, axes=(x,)), axes=(y,))
    tmp1 = np.fft.ifft(np.fft.ifft(tmp0, axis = x), axis = y)
    f = np.fft.fftshift(np.fft.fftshift(tmp1, axes=(x,)), axes=(y,))
    return f * np.sqrt(F.shape[x]* F.shape[y])   

def fft2c(f, axis = (1,2)):
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
    tmp0 = np.fft.fftshift(np.fft.fftshift(f, axes=(x,)), axes=(y,))
    tmp1 = np.fft.fft(np.fft.fft(tmp0, axis = x), axis = y)
    F = np.fft.ifftshift(np.fft.ifftshift(tmp1, axes=(x,)), axes=(y,))
    return F / np.sqrt(f.shape[x]* f.shape[y]) 

def fft(f, type):
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
        return ifft2c(f)
    else:
        return fft2c(f)