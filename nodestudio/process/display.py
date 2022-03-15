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
    
    min = int(np.nanmin(data))
    max = int(np.nanmax(data))
    mean = np.average(data)
    std = np.std(data)

    resolution = 4096
    histogram = np.histogram(data, 128)

    return { 'data':data, 'isScaled': False,'min':min, 'max':max, 'mean':mean, 'std':std, 'resolution':resolution, 'histogram':histogram }

def process_and_scale_data(data):
    # Processes stats and scales data to fit data into a uint16
    output = data

    #set up specifically for t2 mapping
    #output[output == 0] = np.NaN

    min = float(np.nanmin(data))
    max = float(np.nanmax(data))
    mean = np.nanmean(data)
    std = np.nanstd(data)

    resolution = 4096
    output[~np.isnan(output)] = (output[~np.isnan(output)] - min) * resolution / (max - min)
    output = np.floor(output).astype('uint16')
    histogram = np.histogram(output[~np.isnan(output)], 128)

    #output[np.isnan(output)] = 4097

    return { 'data': output, 'isScaled': True, 'min':min, 'max':max, 'mean':mean, 'std':std, 'resolution':resolution, 'histogram':histogram }

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


