import numpy as np
import numpy as np
from dosma.scan_sequences import QDess
from dosma.tissues import FemoralCartilage, TibialCartilage, PatellarCartilage, Meniscus
from core.datagroup import DataGroup
from core.dataset import NodeDataset 
from dosma import DicomWriter
import os

def export_data(data, file_name = "test", type = "Dicoms"):
    dosma_medicalvolume = data.to_medicalvolume()
    dw = DicomWriter()
    data_path = "data/processed/"
    if os.path.isdir(data_path) is False:
        os.mkdir(data_path)
    export_path = data_path+file_name+"/"
    if os.path.isdir(export_path) is False:
        os.mkdir(export_path)
    # dw.save(dosma_medicalvolume, "../../data")
    return data
