import numpy as np
from skimage import io, transform
from core.dataset import NodeDataset
from core.metadata import NodeMetadata

def resize2D(dataset, height, width):
    ''' Resizes image to designated height and width '''

    data = np.moveaxis(dataset.data, 0, 2)
    shape = list(data.shape)
    shape[0] = int(height)
    shape[1] = int(width)
    shape = tuple(shape)

    if np.iscomplexobj(data):
        re = transform.resize(np.real(data), shape, mode='constant')
        im = transform.resize(np.imag(data), shape, mode='constant')
        data = re + im * (1j)
    else:
        data = transform.resize(data, shape, mode='constant')
    data = np.moveaxis(data, 2, 0)

    metadata = NodeMetadata('NoHeader', 'NoHeader')
    ds = NodeDataset(data, metadata, dataset.dims, dataset.tag)
    return ds