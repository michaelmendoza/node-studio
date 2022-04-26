import numpy as np

def SENSErecon(data,sensmap):
    [images,R] = data
    '''
    -------------------------------------------------------------------------
    Parameters
    
    sensmap: array_like
    sensivity maps for each coils [height, width, coils]
    
    images: array_like
    images for each coils [height, width, coils]
    
    R: scalar 
    under sampling ratio 
    
    -------------------------------------------------------------------------
    Returns
    image : array like
    reconstructed image
    
    -------------------------------------------------------------------------
    Notes
    at least sense is much easier to code than GRAPPA :D 
    
    -------------------------------------------------------------------------
    References
    
    [1] 
    Author: Klaas P. Pruessmann et al. 
    Title: SENSE: Sensitivity Encoding for Fast MRI
    Link: https://pubmed.ncbi.nlm.nih.gov/10542355/
    '''
    [height, width, coil] = sensmap.shape
    image = np.zeros([height, width], dtype= complex)
    for y in range(int(height/R)):
        index = np.arange(y,height,int(height/R))
        for x in range(width):
            s = np.transpose(sensmap[index,x,:].reshape(R,-1))
            M = np.matmul(np.linalg.pinv(s),images[y,x,:].reshape(-1,1))    
            image[index,x] = M[:,0]
    return image
