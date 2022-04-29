import numpy as np
from process.fft import *

def cgSolver(Kspace_data, sensitivity_map, numIter = 100):
    '''
    -------------------------------------------------------------------------
    Parameters
    
    Kspace_data: array_like
    undersampled k space data
    
    sensitivity_map: array_like
    sensitivity maps of the coils 
    
    
    numIter: scalar
    number of iterations of the cg algorithm
    
    -------------------------------------------------------------------------
    Returns
    x : array-like
    reconstructed image
    
    -------------------------------------------------------------------------
    Notes: 
    -------------------------------------------------------------------------
    References
    
    [1] 
    Author: Klaas P. Pruessmann et al. 
    Title: SENSE: Sensitivity Encoding for Fast MRI
    Link: https://pubmed.ncbi.nlm.nih.gov/10542355/

    [2] 
    Author: Klaas P. Pruessmann et al. 
    Title: 2D SENSE for faster 3D MRI*
    Link: https://doc.rero.ch/record/317765/files/10334_2007_Article_BF02668182.pdf

    [3] 
    Author: Klaas P. Pruessmann et al. 
    Title: Advances in Sensitivity Encoding With Arbitrary
            k-Space Trajectories
    Link: https://onlinelibrary.wiley.com/doi/pdfdirect/10.1002/mrm.1241

    [4] 
    Author: Jonathan Richard Shewchuk.
    Title: An Introduction to the Conjugate Gradient Method
        Without the Agonizing Pain Edition 1+1/4
    Link: https://www.cs.cmu.edu/~quake-papers/painless-conjugate-gradient.pdf

    [5] 
    Author: Oliver Maier et al.
    Title: CG-SENSE revisited: Results from the first ISMRM reproducibility challenge
    Link: https://onlinelibrary.wiley.com/doi/full/10.1002/mrm.28569

    '''
    dataR = Kspace_data
    sensMap = sensitivity_map
    mask = dataR.any(axis=2)
    imagesR = ifft2c(dataR)
    [height, width, coil] = imagesR.shape
    mask = np.repeat(mask[:, :, np.newaxis], coil, axis=2)
    sconj = np.conj(sensMap)
    B = np.sum(imagesR*sconj,axis = 2)
    B = B.flatten()
    x = 0*B
    r = B 
    d = r 
    for j in range(int(numIter)):
        Ad = np.zeros([height,width],dtype = complex)
        for i in range(coil):  
            Ad += ifft2c(fft2c(d.reshape([height,width])*sensMap[:,:,i])*mask[:,:,i])*sconj[:,:,i] 
        Ad = Ad.flatten()
        a = np.dot(r,r)/(np.dot(d,Ad))
        x = x + a*d
        rn = r - a*Ad
        beta = np.dot(rn,rn)/np.dot(r,r)
        r=rn
        d = r + beta*d
    return x.reshape([height,width])