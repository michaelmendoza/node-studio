import numpy as np

class GRAPPA:
    def __init__(self, _height, _width, _coil, _R, _ACS_length, _fovHeight ,_fovWidth):
        self._kernelheight = _R*(_height-1)+1 
        self._num_vertical = _ACS_length - self._kernelheight +1
        self._num_train = self._num_vertical*_fovWidth
        self._kernelsize = _width*_height*_coil
        self._num_target = _coil * (_R-1)
        self._width = _width
        self._height = _height
        self._fovWidth = _fovWidth
        self._fovHeight = _fovHeight
        self._R = _R
    def _get_xIndex_(self, x):
        return np.mod(np.linspace(x-np.floor(self._width/2), x+np.floor(self._width/2), self._width,dtype = int),self._fovWidth)
    def _get_yIndex_(self, ys):
        return np.mod(np.linspace(ys[int(self._height/2)-1]+1, ys[int(self._height/2)]-1, self._R-1, dtype = int),self._fovHeight)

def GRAPPArecon(data, R = 2, width = 5, height = 4):    
    data_R = data
    [phase, frequency, coil] = data_R.shape
    ACS_lut = np.arange(phase)*0

    # check for ACS lines, for every iteration, check previous, current and next. 
    for i in range(1,phase-1):
        if np.all(data_R[i-1,:,0]!=0) and np.all(data_R[i,:,0]!=0) and np.all(data_R[i+1,:,0]!=0):
            ACS_lut[i-1:i+2] = 1

    ACS_index = np.nonzero(ACS_lut)
    ACS_length = np.size(ACS_index)
    data  = GRAPPA(height,width, coil, R, ACS_length, phase,frequency)
    inMatrix = np.zeros([data._num_train, data._kernelsize], dtype = complex)
    outMatrix = np.zeros([data._num_train, data._num_target], dtype = complex)

    # the self-calibration technique will find the weights that is most consistent with the ACS data in the LSE sense 
    num = 0
    for y in ACS_index[0][0:data._num_vertical]:
        ys = np.linspace(y, y+data._kernelheight-1, height, dtype = int)
        for x in range(frequency):
            x_index = data._get_xIndex_(x)
            in_temp = data_R[ys][:,x_index][:,:,:]
            y_index = data._get_yIndex_(ys)
            out_temp = data_R[y_index,x,:]
            inMatrix[num,:] = in_temp.reshape(1,-1,order= 'F')
            outMatrix[num,:] = out_temp.reshape(1,-1,order= 'F')
            num = num + 1
    w = np.matmul(np.linalg.pinv(inMatrix),outMatrix) 

    #apply the weights to fill
    imageK = np.zeros([phase, frequency, coil], dtype= complex)
    fill_index = np.where(np.sum(np.abs(data_R[:,:,0]), axis=1)==0)[0]
    for y in fill_index:
        y_index = np.mod(np.linspace(y - int((height/2-1) * R + 1), y+int((height/2) * R - 1), height, dtype = int), phase)
        for x in range(frequency):
            x_index = data._get_xIndex_(x)
            kernel = data_R[y_index][:,x_index][:,:,:].reshape(1,-1,order= 'F')
            fill_yidx = data._get_yIndex_(y_index)
            imageK[fill_yidx, x, :] = np.matmul(kernel, w).reshape(1,R-1,coil,order= 'F')
    mergeIndex = np.where(np.sum(np.abs(data_R[:,:,0]), axis=1)!=0)[0]
    imageK[mergeIndex, :, :] = data_R[mergeIndex, :, :]

    images  = np.zeros([phase, frequency, coil], dtype = complex)
    for i in range(coil):
            images[:,:,i] = np.fft.fftshift(np.fft.ifft2(np.fft.fftshift(imageK[:,:,i])))

    return images
