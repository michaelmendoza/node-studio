import glob
import pydicom
import numpy as np
import mapvbvd
import os
import nibabel as nib
def read_file(filetype, filepath):
    if filetype == 'dicom' or filetype == 'dcm':
        return read_dicom(filepath)
    elif filetype == 'nii' or filetype == 'nii.gz' or filetype == 'nifti':
        return read_nifti(filepath)
    elif filetype == 'test':
        return filepath
    else:
        return None
def read_nifti(filepath):
    if os.path.isdir(filepath):
        paths = glob.glob(filepath + '*.nii')       
        paths.extend(glob.glob(filepath + '*.nii.gz'))  
    elif os.path.isfile(filepath):
        paths = [filepath]
    else:
        raise IOError(f"No directory or file found: {filepath}")
    return nib.load(paths[0]).get_fdata()
    
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

