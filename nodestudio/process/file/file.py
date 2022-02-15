import glob
import pydicom
import numpy as np

def read_file(filetype, filepath):
    if filetype == 'dicom' :
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
        print(idx, path)
        dataset = pydicom.dcmread(path)
        data[idx,:,:] = dataset.pixel_array
            
    return data

def read_rawdata():
    pass
