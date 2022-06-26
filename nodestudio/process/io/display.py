import numpy as np
import time 

# Processes data for use by display node. Automatically, detects dtype and complex data.
def process_data(data, complex_datatype = 'mag' ):
    data = data[:]
    N = len(data.shape)

    # Average out dimensions greater than 3
    if N > 3:
        indices = tuple(range(3, N))
        data = np.mean(data, axis=indices)

    # Reshape data into 3D if in 2d
    if N == 2:
        data = np.reshape(data, (1, data.shape[0], data.shape[1]))

    # Check if complex data
    isComplex = False
    if np.iscomplexobj(data):
        data = process_complex_data(data, complex_datatype)
        isComplex = True
    
    # Check if integer data (uint16 - produced by dicoms)
    if data.dtype == 'uint16':
        data = process_uint16_data(data)
    else:
        data = process_and_scale_data(data)
        
    data['isComplex'] = isComplex
    return data

def process_2channel_data(data0, data1):
    # Process data with 2 data channels
    return [process_data(data0), process_data(data1)]

def process_uint16_data(data):
    # Processes stats and histogram for unsigned integer data 
    
    start = time.time()
    min = int(np.nanmin(data))
    max = int(np.nanmax(data))
    mean = np.nanmean(data)
    std = np.nanstd(data)
    process_time = (time.time() - start) * 1000
    print(f'Stats time: {process_time}')

    resolution = 4096
    #histogram = generate_histogram(data)

    return { 'data':data, 'dtype': 'uint16', 'fullshape': data.shape, 'isScaled': False,'min':min, 'max':max, 'mean':mean, 'std':std, 'resolution':resolution }

def process_and_scale_data(data):
    # Processes stats and scales data to fit data into a uint16
    output = data

    min = float(np.nanmin(data))
    max = float(np.nanmax(data))
    mean = np.nanmean(data)
    std = np.nanstd(data)

    start = time.time()
    resolution = 4096
    output = (output - min) * resolution / (max - min)
    output[np.isnan(output)] = 8192 #replace nans
    output = np.floor(output).astype('uint16')
    process_time = (time.time() - start) * 1000
    print(f'Scale time: {process_time}')

    #histogram = generate_histogram(output[output !=8192])

    return { 'data': output, 'dtype': 'uint16', 'fullshape': data.shape, 'isScaled': True, 'min':min, 'max':max, 'mean':mean, 'std':std, 'resolution':resolution  }

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
    
    #    return process_and_scale_data(mdata)
    return mdata

def generate_histogram(data, bins = 16):
    start = time.time()
    histogram = np.histogram(data, bins) 
    histogram = [histogram[0].tolist(), histogram[1].tolist()]
    histogram = [{ 'y': histogram[0][x], 'x0': histogram[1][x], 'x1': histogram[1][x+1] } for x in range(len(histogram[0]))]
    process_time = (time.time() - start) * 1000
    print(f'Histogram time: {process_time}')
    return histogram

def process_historam(data, ignore_zeros = True, complex_datatype = 'mag'):
    data = data[:]
    
    # Check if complex data
    isComplex = False
    if np.iscomplexobj(data):
        data = process_complex_data(data, complex_datatype)
        isComplex = True

    start = time.time()
    min = float(np.nanmin(data))
    max = float(np.nanmax(data))
    mean = np.nanmean(data)
    std = np.nanstd(data)
    process_time = (time.time() - start) * 1000
    print(f'Stats time: {process_time}')

    histogram = generate_histogram(data)

    return { 'min':min, 'max':max, 'mean':mean, 'std':std, 'histogram':histogram, 'isComplex':isComplex }
