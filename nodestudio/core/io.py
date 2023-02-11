import os
import glob
import uuid
import pydicom
import numpy as np
import mapvbvd

from core.dataset import NodeDataset
from core.metadata import NodeMetadata
from core.datagroup import DataGroup
import nibabel as nib
files_loaded = {}

def get_filedata(file):
    ''' Retrieves file data from files_loaded cache. '''

    id = file['id']
    if(id in files_loaded):
        return files_loaded[id]['data']
    else:
        id = read_file(file['filepath'])
        return files_loaded[id]['data']

def read_file(filepath, id = None):
    id = uuid.uuid1().hex if id == None else id

    ''' Detects valid files in filepath and reads file, and places data in io datastore '''
    if os.path.isdir(filepath):
        # Read raw data files in folder (load one dataset per file)
        filepath = os.path.join(filepath, '') # Added ending slash if needed
        paths = glob.glob(filepath + '*.dat') 
        for filename in paths:
            id = uuid.uuid1().hex
            files_loaded[id] = { 'id':id, 'path':filename, 'name':f'File {len(files_loaded)}', 'type':'raw data', 'data': read_rawdata(filename)} 

        # Read raw data files in folder (load one dataset/datagroup per folder)
        paths = glob.glob(filepath + '*.dcm')        
        paths.extend(glob.glob(filepath + '*.ima'))
        paths.extend(glob.glob(filepath + '*.nii'))
        paths.extend(glob.glob(filepath + '*.nii.gz'))
        if len(paths) > 0:
            files_loaded[id] = { 'id':id, 'path':filepath, 'name':f'File {len(files_loaded)}', 'type':'dicom', 'data': read_dicom(filepath)}  
    else:
        # Check for file extension and read dicom / raw data files
        filename, file_extension = os.path.splitext(filepath)
        if file_extension == '.dat':
            files_loaded[id] = { 'id':id, 'path':filepath, 'name':f'File {len(files_loaded)}', 'type':'raw data', 'data': read_rawdata(filepath)}  
        if file_extension == '.dcm' or file_extension == '.ima':
            files_loaded[id] = { 'id':id, 'path':filepath, 'name':f'File {len(files_loaded)}', 'type':'dicom', 'data': read_dicom(filepath)}  
        if file_extension == '.nii' or file_extension == '.nii.gz' or file_extension== '.gz':
            files_loaded[id] = { 'id':id, 'path':filepath, 'name':f'File {len(files_loaded)}', 'type':'nifti', 'data': read_nifti(filepath)}
    return id

def read_dicom(filepath, group_by=None, sort_by=None):
    ''' Reads dicom files from a folder or single file. Groups data if group_by is set to tag in dicom header'''

    # Get filenames and sort alphabetically
    if os.path.isdir(filepath):
        paths = glob.glob(filepath + '*.dcm')        # add .dcm files
        paths.extend(glob.glob(filepath + '*.ima'))  # add .ima files
        
    elif os.path.isfile(filepath):
        paths = [filepath]
    else:
        raise IOError(f"No directory or file found: {filepath}")
    paths = sorted(paths)

    # Read dicom files
    headers = {}
    for idx, path in enumerate(paths):
        dicom = pydicom.dcmread(path, force=True)

        # Group dicoms by group_by tag
        if group_by:
            group_key = dicom.EchoNumbers
        else:
            group_key = 0

        if group_key in headers:
            headers[group_key].append(dicom)
        else:
            headers[group_key] = [dicom]

    # TODO: sort_by tag after group_by

    # For each datagroup item - Create a dataset
    datagroup = []
    for key in headers.keys():
        depth = len(headers[key])
        height = headers[key][0].pixel_array.shape[0]
        width = headers[key][0].pixel_array.shape[1]

        # Create data array from dicoms            
        data = np.zeros((depth, height, width), dtype='uint16')
        for idx, header in enumerate(headers[key]):
            data[idx,:,:] = header.pixel_array

        # Create metadata and datasets
        metadata = NodeMetadata(headers[key], 'dicom')
        dataset = NodeDataset(data, metadata, ['Sli', 'Lin', 'Col'])
        datagroup.append(dataset)

    if len(datagroup) == 1:
        return datagroup[0]
    else:
        return DataGroup(datagroup)

def read_rawdata(filepath, datatype='image'):
    ''' Reads rawdata files and returns NodeDataset '''

    twixObj = mapvbvd.mapVBVD(filepath)
    sqzDims = twixObj.image.sqzDims    
    twixObj.image.squeeze = True

    data = twixObj.image['']
    # Move Lin be first index
    linIndex = sqzDims.index('Lin')
    data = np.moveaxis(data, linIndex, 0)
    sqzDims.insert(0, sqzDims.pop(linIndex))

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

    metadata = NodeMetadata(twixObj.hdr, 'rawdata')
    dataset = NodeDataset(data, metadata, sqzDims)
    return dataset

def read_nifti(filepath):
    if os.path.isdir(filepath):
        paths = glob.glob(filepath + '*.nii')       
        paths.extend(glob.glob(filepath + '*.nii.gz'))  
    elif os.path.isfile(filepath):
        paths = [filepath]
    else:
        raise IOError(f"No directory or file found: {filepath}")
    datagroup = []
    for idx, path in enumerate(paths):
        datagroup.append(nib.load(path).get_fdata())
    if len(datagroup) == 1:
        return datagroup[0]
    else:
        return DataGroup(datagroup)