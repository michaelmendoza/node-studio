import numpy as np
from dosma import MedicalVolume
from core.metadata import NodeMetadata

class NodeDataset():
    
    def __init__(self, data, metadata: NodeMetadata, dims = [], tag = ''): 
        self.data = data  # numpy array data
        self.metadata = metadata # NodeMetadata
        self.dims = dims # array of the names of data dimensions
        self.tag = tag # optional - tag info

    def __repr__(self):
        return f'NodeDataset: {self.shape}, {self.dims}'

    def __getitem__(self, key):
        return self.data[key]

    def __setitem__(self, key, newvalue):
        self.data[key] = newvalue

    def to_medicalvolume(self):
        if self.ndim == 3:
            if self.metadata.type == 'dicom':
                headers = self.metadata.headers
            else:
                headers = None
            data = np.moveaxis(self.data, 0, 2)
            mv = MedicalVolume(data, np.eye(4), headers=headers)
            return mv
        
    def to_numpy(self):
        return self.data

    @property
    def shape(self):
        """The shape of the underlying ndarray."""
        return self.data.shape

    @property
    def ndim(self):
        """int: The number of dimensions of the underlying ndarray."""
        return self.data.ndim

    @property
    def dtype(self):
        """The ``dtype`` of the ndarray. Same as ``self.volume.dtype``."""
        return self.data.dtype
