import numpy as np
# this deals with high dimensional data, eg. [y, x, coil, slice]

def ifft2c(F, axis = (0,1)):
    x,y = (axis)
    tmp0 = np.fft.ifftshift(np.fft.ifftshift(F, axes=(x,)), axes=(y,))
    tmp1 = np.fft.ifft(np.fft.ifft(tmp0, axis = x), axis = y)
    f = np.fft.fftshift(np.fft.fftshift(tmp1, axes=(x,)), axes=(y,))
    return f   

def fft2c(f, axis = (0,1)):
    x,y = (axis)
    tmp0 = np.fft.fftshift(np.fft.fftshift(f, axes=(x,)), axes=(y,))
    tmp1 = np.fft.fft(np.fft.fft(tmp0, axis = x), axis = y)
    F = np.fft.ifftshift(np.fft.ifftshift(tmp1, axes=(x,)), axes=(y,))
    return F   

def fft(f, type):
    if type == "ifft":
        return ifft2c(f)
    else:
        return fft2c(f)