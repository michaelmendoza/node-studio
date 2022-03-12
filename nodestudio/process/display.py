import numpy as np

def process_int_data(data, datatype = None):
    # Process integer data 
    
    min = np.min(data)
    max = np.max(data)
    mean = np.average(data)
    std = np.std(data)

    resolution = 4096
    histogram = np.histogram(data, 4096)

    return { 'min':min, 'max':max, 'mean':mean, 'std':std, 'resolution':resolution, 'histogram':histogram }

def process_complex_data(data, datatype = None):
    # Process complex128 numpy data 
    
    if type == 'mag': 
        mdata = np.abs(data)
    elif type == 'angle':
        mdata = np.angle(data)
    elif type == 'real':
        mdata = np.real(data)
    elif type == 'imag':
        mdata = np.imag(data)
    else:
        return None
    
    min = np.min(mdata)
    max = np.max(mdata)
    mean = np.average(mdata)
    std = np.std(mdata)

    scaled_data = (mdata - min) / (max - min)
    resolution = 4096
    data_int = np.floor(scaled_data * resolution).astype(int)
    histogram = np.histogram(data_int, 4096)

    return { 'min':min, 'max':max, 'mean':mean, 'std':std, 'resolution':resolution, 'histogram':histogram }
