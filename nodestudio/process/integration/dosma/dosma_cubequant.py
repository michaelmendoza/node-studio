import numpy as np
from dosma.scan_sequences import QDess, CubeQuant, Cones
from dosma.tissues import FemoralCartilage, TibialCartilage, PatellarCartilage, Meniscus
from core.datagroup import DataGroup
from core.dataset import NodeDataset 

def dosma_cubequant(data):

    cubequant = []
    try: 
        cubequant = data.to_Cubequant()
    except:
        raise Exception("Error when converting datagroup to dosma cubequant sequence")

    # read metadata -> we need to consider how to deal with this
    metadata = data[0].metadata
    dims = data[0].dims
    dataset = NodeDataset(cubequant.volumes[0].A, metadata , dims, "quantitiveMapping")
    return DataGroup([dataset])