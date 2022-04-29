from pynufft import NUFFT
import numpy as np

'''
package from pyNUFFT
'''

'''
----------------------------------------------------------------------------------------
simulate radial traj, will add spiral later 
'''
def nufft_sampling(type, R):
    '''
    -------------------------------------------------------------------------
    Parameters
    
    type: string
    type of sampling trajectory

    R: scalar 
    undersampling ratio

    -------------------------------------------------------------------------
    Returns
    om : array-like
    sampling trajectory
    
    -------------------------------------------------------------------------
    Notes: 

    -------------------------------------------------------------------------
    References:

    [1]: 
        pyNUFFT documentation : http://jyhmiinlin.github.io/pynufft/
    '''
    if type == "radial":
        return nufft_radial(int(R))

def nufft_radial(R = 1):
    '''
    -------------------------------------------------------------------------
    Parameters
    
    R: scalar 
    undersampling ratio

    -------------------------------------------------------------------------
    Returns
    om : array-like
    sampling trajectory
    
    -------------------------------------------------------------------------
    Notes: 

    -------------------------------------------------------------------------
    References:

    [1]: 
        pyNUFFT documentation : http://jyhmiinlin.github.io/pynufft/
    '''
    spoke_range = (np.arange(0, 512) - 256.0 )/ 256  # normalized between -pi and pi
    M = 512*360
    om = np.empty((M,2), dtype = np.float32)
    for angle in range(0, 360):
       radian = angle * 2 * np.pi/ 360.0
       spoke_x =  spoke_range * np.cos(radian)
       spoke_y =  spoke_range * np.sin(radian)
       om[512*angle : 512*(angle + 1) ,0] = spoke_x
       om[512*angle : 512*(angle + 1) ,1] = spoke_y
    return om[::R]

def nufft_forward(image, traj):
    '''
    -------------------------------------------------------------------------
    Parameters
    
    image: array_like
    image to be sampled

    traj: array_like
    undersampling ratio

    -------------------------------------------------------------------------
    Returns
    NufftObj.forward(image): array_like
    sampled data

    [fovHeight, fovWidth]: int
    dimensions of the image 

    -------------------------------------------------------------------------
    Notes: 

    -------------------------------------------------------------------------
    References:

    [1]: 
        pyNUFFT documentation : http://jyhmiinlin.github.io/pynufft/
    '''
    [fovHeight, fovWidth] = image.shape
    NufftObj = NUFFT()
    Nd = (fovHeight, fovWidth)  # image size
    Kd = (fovHeight * 2, fovWidth * 2)  # k-space size
    Jd = (6, 6)  # interpolation size
    NufftObj.plan(traj * np.pi, Nd, Kd, Jd)
    return [NufftObj.forward(image), [fovHeight, fovWidth]]

def nufft_inverse(data, traj):
    if len(data) == 2:
        dat, fov = data
        trj = traj
        [fovHeight, fovWidth] = fov
    if len(traj) == 2:
        trj = data
        [dat,fov]= traj
        [fovHeight, fovWidth] = fov
    '''
    -------------------------------------------------------------------------
    Parameters
    
    dat: array_like
    sampled data

    fov: int
    image dimension

    traj: array_like
    sampling trajectory

    -------------------------------------------------------------------------
    Returns
    image
    reconstructed image
    
    -------------------------------------------------------------------------
    Notes: 

    -------------------------------------------------------------------------
    References:

    [1]: 
        pyNUFFT documentation : http://jyhmiinlin.github.io/pynufft/
    '''
    NufftObj = NUFFT()
    Nd = (fovHeight, fovWidth)  # image size
    Kd = (fovHeight * 2, fovWidth * 2)  # k-space size
    Jd = (6, 6)  # interpolation size
    NufftObj.plan(trj * np.pi, Nd, Kd, Jd)
    image =  NufftObj.solve(dat, solver='cg',maxiter=50)
    return image