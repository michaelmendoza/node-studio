import numpy as np
from core import NodeDataset, NodeMetadata, DataGroup

def group_by(dataset, group_by=None):
    if not isinstance(dataset, NodeDataset):
        return dataset
    if (dataset.metadata.type != 'dicom'):
        return dataset

    headers = {}
    for idx, dicom in enumerate(dataset.metadata.headers):
        # Group dicoms by group_by tag
        if group_by:
            group_key = dicom.EchoNumbers
        else:
            group_key = 0

        if group_key in headers:
            headers[group_key].append(dicom)
        else:
            headers[group_key] = [dicom]

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
