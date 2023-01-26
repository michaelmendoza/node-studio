import numpy as np
from dosma import MedicalVolume
from dosma.core.io.dicom_io import to_RAS_affine
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

    def __add__(self, other):
        return self.data + other

    def __sub__(self, other):
        return self.data - other

    def __mul__(self, other):
        return self.data * other

    def __lt__(self, other):
        return self.data < other

    def __le__(self, other):
        return self.data <= other

    def __eq__(self, other):
        return self.data == other

    def __ne__(self, other):
        return self.data != other

    def __ge__(self, other):
        return self.data > other

    def __gt__(self, other):
        return self.data >= other

    def is_medicalvolume(self):
        return isinstance(self.value, MedicalVolume)

    def to_medicalvolume(self):
        if self.ndim == 3:
            if self.metadata.type == 'dicom':
                headers = self.metadata.headers
            else:
                headers = None
            data = np.moveaxis(self.data, 0, 2)
            affine = to_RAS_affine(headers)
            mv = MedicalVolume(data, affine, headers=headers)
            return mv
        
    @classmethod
    def from_medicalvolume(cls, mv):
        if not isinstance(mv, MedicalVolume):
             return None

        data = np.moveaxis(mv.A, 2, 0)
        header_type = 'dicom'
        headers = mv._headers[0,0,:].tolist()
        metadata = NodeMetadata(headers, header_type)
        dataset = NodeDataset(data, metadata, ['Sli', 'Lin', 'Col'])
        return dataset

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

    @property
    def depth(self):
        """Retrieves the width of dataset image."""
        return self.data.shape[0]

    @property
    def height(self):
        """Retrieves the width of dataset image."""
        return self.data.shape[1]

    @property
    def width(self):
        """Retrieves the width of dataset image."""
        return self.data.shape[2]