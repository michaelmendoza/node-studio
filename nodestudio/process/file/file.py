import glob
import pydicom
import numpy as np
import mapvbvd
from pathlib import Path

def read_file(filetype, filepath):
    if filetype == 'dicom' or filetype == 'dcm':
        return read_dicom(filepath)
    #------for testing------
    elif filetype == 'test':
        return filepath
    #------for testing------
    else:
        return None

# def read_testfile(filepath):
#     # paths = glob.glob(filepath + '*.IMA')
#     # paths = sorted(paths)

#     # dataset = pydicom.dcmread(paths[0])
#     # depth = len(paths)
#     # height = dataset.pixel_array.shape[0]
#     # width = dataset.pixel_array.shape[1]

#     # data = np.zeros((depth, height, width), dtype='uint16')
#     # for idx, path in enumerate(paths):
#     #     dataset = pydicom.dcmread(path)
#     #     data[idx,:,:] = dataset.pixel_array
            
#     return data

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

def read_rawdata(filepath, datatype, avg_coils, avg_averages, avg_phase_cycles):
    twixObj = mapvbvd.mapVBVD(filepath)
    sqzDims = twixObj.image.sqzDims    
    twixObj.image.squeeze = True

    data = twixObj.image['']
    # Move Lin be first index
    linIndex = sqzDims.index('Lin')
    data = np.moveaxis(data, linIndex, 0)
    sqzDims.insert(0, sqzDims.pop(linIndex))

    if avg_coils and 'Cha' in sqzDims:
        chaIndex = sqzDims.index('Cha')
        data = np.mean(data, axis=chaIndex)
        sqzDims.pop(chaIndex)

    if avg_averages and 'Ave' in sqzDims:
        aveIndex = sqzDims.index('Ave')
        data = np.mean(data, axis=aveIndex)
        sqzDims.pop(aveIndex)

    if avg_phase_cycles and 'Rep' in sqzDims:
        repIndex = sqzDims.index('Rep')
        data = np.mean(data, axis=repIndex)
        sqzDims.pop(repIndex)

    if datatype == 'image':
        data = np.fft.fftshift(np.fft.ifft2(np.fft.fftshift(data, axes=(0, 1)), axes=(0, 1)), axes=(0, 1))
    else: # datatype is kspace
        pass

    if 'Sli' in sqzDims:
        sliceIndex = sqzDims.index('Sli')
        data = np.moveaxis(data, sliceIndex, 0)
        sqzDims.insert(0, sqzDims.pop(sliceIndex))
    else:
        # Make 2d dataset into 3d dataset with one slice
        data = np.expand_dims(data, axis=0)

    return data
