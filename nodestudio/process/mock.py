import numpy as np
from process.reformat import reformat

def mock_2d_data(pattern):
    xdim = 50
    ydim = 50
    data = np.zeros((ydim,xdim))

    if pattern == 'linear':
        line = np.linspace(0,xdim-1,num=xdim)
        for j in range(ydim-1):
            data[j,:] = line

    elif pattern == 'radial':
        for j in range(ydim-1):
            for i in range(xdim-1):
                data[j,i] = ((j+1-ydim/2)**2+(i+1-xdim/2)**2)**0.5

    # data = reformat(data)
    # data = np.reshape(data,(1,data.shape[0],data.shape[1]))

    # min = np.min(data)
    # max = np.max(data)
    # scaled_data = (data - min) / (max - min)
    # resolution = 4096
    # data = np.floor(scaled_data * resolution).astype('uint16')

    return data


    