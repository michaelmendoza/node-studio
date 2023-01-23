from nodestudio.core.dataset import NodeDataset
from dosma.scan_sequences import QDess, CubeQuant, Cones
from dosma.scan_sequences.scans import ScanSequence
class DataGroup():
    def __init__(self, dataGroup = {}):
        
        if isinstance(dataGroup, list):
            indices = list(range(len(dataGroup)))
            dataGroup = dict(zip(indices, dataGroup)) # convert list to dict 
        elif isinstance(dataGroup, dict):
            pass
        else:
            raise Exception("dataGroup is invalid datatype - Requires list or dict of NodeDatasets")

        self.group = dataGroup

    def __repr__(self):
        return str(self.group)

    @property
    def value(self): # Reference to values()
        return list(self.group.values())

    def values(self): # behave like dictionary
        return list(self.group.values())

    def keys(self):
         return list(self.group.keys())

    def add(self, key: str, dataset: NodeDataset):
        if key in self.group.keys():
            raise Exception("key not unique")
        self.group[key] = dataset

    def __getitem__(self, key: str):
        return self.group[key]

    def __setitem__(self, key:str, value: NodeDataset):
        if key not in self.group.keys():
            raise Exception("key does not exist")
        self.group[key] = value

    def to_medicalvolumes(self):
        volumes = [ds.to_medicalvolume() for ds in self.group.values()]
        return volumes

    def to_QDess(self):
        volumes = [ds.to_medicalvolume() for ds in self.group.values()]
        qdess = QDess(volumes)
        return qdess

    def to_Cubequant(self):
        volumes = [ds.to_medicalvolume() for ds in self.group.values()]
        cubequant = CubeQuant(volumes)
        return cubequant

    def to_Cones(self):
        volumes = [ds.to_medicalvolume() for ds in self.group.values()]
        cones = Cones(volumes)
        return cones

    def to_ScanSequence(self):
        volumes = [ds.to_medicalvolume() for ds in self.group.values()]
        seq = ScanSequence(volumes)
        return seq
