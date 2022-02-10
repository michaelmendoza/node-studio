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
    for path in paths:
        dataset = pydicom.dcmread(path)
        
        if path == paths[0]:
            data = dataset.pixel_array[None,:]
        else:
            data = np.concatenate((data, dataset.pixel_array[None,:]), axis=0)
            
    return data
