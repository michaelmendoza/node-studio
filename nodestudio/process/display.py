import numpy as np

# Processes data for use by display node. Automatically, detects dtype and complex data.
def process_data(data):

    # Check if complex data
    if np.iscomplexobj(data):
        output = process_complex_data(data)

    # Check if integer data (uint16 - produced by dicoms)
    if data.dtype == 'uint16':
        output = process_uint16_data(data)

    else:
        output = process_and_scale_data(data)
    
    return output

def process_uint16_data(data):
    # Processes stats and histogram for unsigned integer data 
    
    min = int(np.min(data))
    max = int(np.max(data))
    mean = np.average(data)
    std = np.std(data)

    resolution = 4096
    histogram = np.histogram(data, 128)

    return { 'data':data, 'isScaled': False,'min':min, 'max':max, 'mean':mean, 'std':std, 'resolution':resolution, 'histogram':histogram }

def process_and_scale_data(data):
    # Processes stats and scales data to fit data into a uint16

    min = float(np.nanmin(data))
    max = float(np.nanmax(data))
    mean = np.average(data)
    std = np.std(data)

    scaled_data = (data - min) / (max - min)
    resolution = 4096
    data_int = np.floor(scaled_data * resolution).astype('uint16')
    histogram = np.histogram(data_int, 128)

    return { 'data': data_int, 'isScaled': True, 'min':min, 'max':max, 'mean':mean, 'std':std, 'resolution':resolution, 'histogram':histogram }

def process_complex_data(data, datatype = 'mag'):
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
        mdata = np.abs(data)
    
    return process_and_scale_data(mdata)
