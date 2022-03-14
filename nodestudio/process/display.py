import numpy as np

def process_uint_data(data):
    # Process unsigned integer data 
    
    min = int(np.min(data))
    max = int(np.max(data))
    mean = np.average(data)
    std = np.std(data)

    resolution = 4096
    histogram = np.histogram(data, 128)

    return { 'data':data, 'isScaled': False,'min':min, 'max':max, 'mean':mean, 'std':std, 'resolution':resolution, 'histogram':histogram }

def process_complex_data(data, datatype = None):
    # Process complex128 numpy data 
    
    if datatype == 'mag': 
        mdata = np.abs(data)
    elif datatype == 'angle':
        mdata = np.angle(data)
    elif datatype == 'real':
        mdata = np.real(data)
    elif datatype == 'imag':
        mdata = np.imag(data)
    else:
        return None
    
    min = float(np.min(mdata))
    max = float(np.max(mdata))
    mean = np.average(mdata)
    std = np.std(mdata)

    scaled_data = (mdata - min) / (max - min)
    resolution = 4096
    data_int = np.floor(scaled_data * resolution).astype('uint16')
    histogram = np.histogram(data_int, 128)

    return { 'data': data_int, 'isScaled': True, 'min':min, 'max':max, 'mean':mean, 'std':std, 'resolution':resolution, 'histogram':histogram }
