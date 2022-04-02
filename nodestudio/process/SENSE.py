import numpy as np

def SENSErecon(data,sensmap):
    [images,R] = data
    shape = sensmap.shape
    width = shape[0]
    height = shape[1]
    image = np.zeros([width,height], dtype= complex)
    for x in range(int(height/R)):
        index = np.arange(x,width,int(width/R))
        for y in range(width):
            s = np.transpose(sensmap[index,y,:].reshape(R,-1))
            M = np.matmul(np.linalg.pinv(s),images[x,y,:].reshape(-1,1))    
            image[index,y] = M[:,0]
    return image