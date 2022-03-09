import glob
import pydicom
import numpy as np
import mapvbvd

def read_file(filetype, filepath):
    if filetype == 'dicom' or filetype == 'dcm':
        return read_dicom(filepath)
    else:
        return None

def read_dicom(filepath):
    ''' Reads dicom data and returns a 3d image dataset '''

    paths = glob.glob(filepath + '*.dcm')
    paths = sorted(paths)

    dataset = pydicom.dcmread(paths[0])
    depth = len(paths)
    height = dataset.pixel_array.shape[0]
    width = dataset.pixel_array.shape[1]

    data = np.zeros((depth, height, width), dtype='uint16')
    for idx, path in enumerate(paths):
        dataset = pydicom.dcmread(path)
        data[idx,:,:] = dataset.pixel_array
            
    return data

def read_rawdata(filename, useFFT, avg_coil, avg_averages, avg_phase_cycles):
    twixObj = mapvbvd.mapVBVD(filename)
    sqzDims = twixObj.image.sqzDims    
    twixObj.image.squeeze = True

    data = twixObj.image['']
    # Move Lin be first index
    linIndex = sqzDims.index('Lin')
    data = np.moveaxis(data, linIndex, 0)
    sqzDims.insert(0, sqzDims.pop(linIndex))

    if avg_coil:
        chaIndex = sqzDims.index('Cha')
        reduced_data = np.mean(data, axis=chaIndex)
        sqzDims.pop(chaIndex)

    if avg_averages:
        aveIndex = sqzDims.index('Ave')
        reduced_data = np.mean(reduced_data, axis=aveIndex)
        sqzDims.pop(aveIndex)

    if avg_phase_cycles:
        repIndex = sqzDims.index('Rep')
        reduced_data = np.mean(reduced_data, axis=repIndex)
        sqzDims.pop(repIndex)

    if useFFT:
        data = np.fft.fftshift(np.fft.ifft2(np.fft.fftshift(data, axes=(0, 1)), axes=(0, 1)), axes=(0, 1))

    if 'Sli' in sqzDims:
        sliceIndex = sqzDims.index('Sli')
        data = np.moveaxis(data, sliceIndex, 0)
        sqzDims.insert(0, sqzDims.pop(sliceIndex))
    else:
        # Make 2d dataset into 3d dataset with one slice
        data = np.expand_dims(data, axis=0)

    return data