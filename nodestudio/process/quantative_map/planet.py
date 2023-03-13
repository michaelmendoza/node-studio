import numpy as np
from core.dataset import NodeDataset 
from core.datagroup import DataGroup
from ssfp import planet

def planet(data):

    dataset = data.data
    # need to implement alpha, T2 and phase cycle
    
    Meff, T1, T2, df = planet(dataset, alpha, TR, pcs=np.linspace(0, np.pi * 2, 8))
    M0maps = NodeDataset(Meff, data.metadata, Meff.shape, "image")
    T1maps = NodeDataset(T1, data.metadata, T1.shape, "image")
    T2maps = NodeDataset(T2, data.metadata, T2.shape, "image")
    return  DataGroup({"M0maps": M0maps, "T1maps": T1maps, "T2maps":T2maps})
