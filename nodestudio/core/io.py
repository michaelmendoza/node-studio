
from email import header
import os
import glob
import pydicom
import numpy as np
import mapvbvd
from requests import head

from core.dataset import NodeDataset
from core.metadata import NodeMetadata

def read_dicom(filepath, group_by=None, sort_by=None):
    ''' Reads dicom files from a folder or single file. Groups data if group_by is set to tag in dicom header'''

    # Get filenames and sort alphabetically
    if os.path.isdir(filepath):
        paths = glob.glob(filepath + '*.dcm')
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
        for idx, header in enumerate(headers[key]):
            data = np.zeros((depth, height, width), dtype='uint16')
            data[idx,:,:] = header.pixel_array

        # Create metadata and datasets
        metadata = NodeMetadata(headers[group_key], 'dicom')
        dataset = NodeDataset(data, metadata, ['Sli', 'Lin', 'Col'])
        datagroup.append(dataset)

    if len(datagroup) == 1:
        return datagroup[0]
    else:
        return datagroup

    '''
    dataset = pydicom.dcmread(paths[0])
    depth = len(paths)
    height = dataset.pixel_array.shape[0]
    width = dataset.pixel_array.shape[1]

    headers = []
    data = np.zeros((depth, height, width), dtype='uint16')
    for idx, path in enumerate(paths):
        dataset = pydicom.dcmread(path, force=True)
        data[idx,:,:] = dataset.pixel_array
        headers.append(dataset)

    metadata = NodeMetadata(headers, 'dicom')
    dataset = NodeDataset(data, metadata, ['Sli', 'Lin', 'Col'])
    return dataset
    '''

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