from core.dataset import NodeDataset
from typing import Dict 

class DataGroup():
    def __init__(self, datasetArray): # : Dict[NodeDataset] = {}
        self.group = datasetArray
    
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

    

    

