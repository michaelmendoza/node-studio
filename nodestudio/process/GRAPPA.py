import numpy as np

class GRAPPA:
    def __init__(self, kh, kw, nc, R, lenACS, ny ,nx):
        self.kernelheight = R*(kh-1)+1 
        self.num_vertical = lenACS - self.kernelheight +1
        self.num_train = self.num_vertical*nx
        self.kernelsize = kw*kh*nc
        self.num_target = nc * (R-1)
        self.kw = kw
        self.kh = kh
        self.nx = nx
        self.ny = ny
        self.R = R
    def _get_xIndex_(self, x):
        return np.mod(np.linspace(x-np.floor(self.kw/2), x+np.floor(self.kw/2), self.kw,dtype = int),self.nx)
    def _get_yIndex_(self, ys):
        return np.mod(np.linspace(ys[int(self.kh/2)-1]+1, ys[int(self.kh/2)]-1, self.R-1, dtype = int),self.ny)

def GRAPPArecon(data, R = 2, width = 5, height = 4):    
    '''
    -------------------------------------------------------------------------
    Parameters
    data: array_like
    undersampled k space data [height, width, coils]

    R: scalar
    undersampling ratio

    width: scalar 
    grappa kernel width 

    height: scalar 
    grappa kernel height
    
    -------------------------------------------------------------------------
    Returns
    image : array like
    reconstructed image for each coil 
    -------------------------------------------------------------------------
    Notes
    -------------------------------------------------------------------------
    References
    [1] 
    Author: Mark A. Griswold et al. 
    Title: Generalized Autocalibrating Partially Parallel Acquisitions (GRAPPA)
    Link: https://pubmed.ncbi.nlm.nih.gov/12111967/
    '''
    dataR = data
    [ny, nx, nc] = dataR.shape
    ACS_lut = np.arange(ny)*0
    for i in range(1,ny-1):
        if np.all(dataR[i-1,:,0]!=0) and np.all(dataR[i,:,0]!=0) and np.all(dataR[i+1,:,0]!=0):
            ACS_lut[i-1:i+2] = 1
    ACS_index = np.nonzero(ACS_lut)
    ACS_length = np.size(ACS_index)
    data  = GRAPPA(height,width, nc, R, ACS_length, ny,nx)
    inMatrix = np.zeros([data.num_train, data.kernelsize], dtype = complex)
    outMatrix = np.zeros([data.num_train, data.num_target], dtype = complex)
    # the self-calibration technique will find the weights that is most consistent with the ACS data in the LSE sense 
    num = 0
    for y in ACS_index[0][0:data.num_vertical]:
        ys = np.linspace(y, y+data.kernelheight-1, height, dtype = int)
        for x in range(nx):
            x_index = data._get_xIndex_(x)
            in_temp = dataR[ys][:,x_index][:,:,:]
            y_index = data._get_yIndex_(ys)
            out_temp = dataR[y_index,x,:]
            inMatrix[num,:] = in_temp.reshape(1,-1)
            outMatrix[num,:] = out_temp.reshape(1,-1)
            num = num + 1
    w = np.matmul(np.linalg.pinv(inMatrix),outMatrix) 

    #apply the weights to fill
    imageK = np.zeros([ny, nx, nc], dtype= complex)
    fill_index = np.where(np.sum(np.abs(dataR[:,:,0]), axis=1)==0)[0]
    for y in fill_index:
        y_index = np.mod(np.linspace(y - int((height/2-1) * R + 1), y+int((height/2) * R - 1), height, dtype = int), ny)
        for x in range(nx):
            x_index = data._get_xIndex_(x)
            kernel = dataR[y_index][:,x_index][:,:,:].reshape(1,-1)
            fill_yidx = data._get_yIndex_(y_index)
            imageK[fill_yidx, x, :] = np.matmul(kernel, w).reshape(1,R-1,nc)
    mergeIndex = np.where(np.sum(np.abs(dataR[:,:,0]), axis=1)!=0)[0]
    imageK[mergeIndex, :, :] = dataR[mergeIndex, :, :]

    images  = np.zeros([ny, nx, nc], dtype = complex)
    for i in range(nc):
            images[:,:,i] = np.fft.fftshift(np.fft.ifft2(np.fft.fftshift(imageK[:,:,i])))

    return images
