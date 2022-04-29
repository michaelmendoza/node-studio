import numpy as np
from process.fft import * 

def SENSErecon(data,sensmap):
    [kspaceData,R] = data
    '''
    -------------------------------------------------------------------------
    Parameters
    
    sensmap: array_like
    sensivity maps for each coils [height, width, coils]
    
    kspaceData: array_like
    k space data for each coils [height, width, coils]
    
    R: scalar 
    under sampling ratio 
    
    -------------------------------------------------------------------------
    Returns
    image : array like
    reconstructed image
    
    -------------------------------------------------------------------------
    References
    
    [1] 
    Author: Klaas P. Pruessmann et al. 
    Title: SENSE: Sensitivity Encoding for Fast MRI
    Link: https://pubmed.ncbi.nlm.nih.gov/10542355/
    '''
    images = ifft2c(kspaceData)
    [height, width, coil] = sensmap.shape
    image = np.zeros([height, width], dtype= complex)
    for y in range(int(height/R)):
        index = np.arange(y,height,int(height/R))
        for x in range(width):
            s = np.transpose(sensmap[index,x,:].reshape(R,-1))
            M = np.matmul(np.linalg.pinv(s),images[y,x,:].reshape(-1,1))    
            image[index,x] = M[:,0]
    return image
