from core.dataset import NodeDataset
from dosma.scan_sequences import QDess
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

    def to_QDess(self):
        volumes = [ds.to_medicalvolume() for ds in self.group.values()]
        qdess = QDess(volumes)
        return qdess

    def to_ScanSequence(self):
        volumes = [ds.to_medicalvolume() for ds in self.group.values()]
        seq = ScanSequence(volumes)
        return seq