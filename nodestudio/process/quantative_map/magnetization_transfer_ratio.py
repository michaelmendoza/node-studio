import numpy as np
from core.datagroup import DataGroup
from core.dataset import NodeDataset 

def list_2_3D(data):
    ny, nx = data[0].shape
    out = np.zeros([len(data), ny, nx])
    for i in range(len(data)):
        out[i] = data[i]
    return out 

def mtr(scan):
    ns, ny, nx = scan.shape
    So = []
    Smt = []
    for sli in range(ns):
        if "MT" in scan.metadata.headers[sli][(0x0018, 0x0022)].value:
            Smt.append(scan[sli])
        else: 
            So.append(scan[sli])
    if len(So) != len(Smt): 
        raise Exception("Error")

    So = list_2_3D(So)
    Smt = list_2_3D(Smt)
    mtr = (So-Smt)/(So+np.finfo(float).eps)
    return mtr