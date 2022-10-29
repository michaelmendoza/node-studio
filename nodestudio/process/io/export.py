from tabnanny import check
import numpy as np
import numpy as np
from dosma.scan_sequences import QDess
from dosma.tissues import FemoralCartilage, TibialCartilage, PatellarCartilage, Meniscus
from core.datagroup import DataGroup
from core.dataset import NodeDataset 
from dosma import DicomWriter
import os
from scipy.io import savemat
import dicom2nifti
import shutil

def check_and_create_dir(path):
    if os.path.isdir(path) is False:
        os.mkdir(path)

def export_data(data, file_name = "test", type = "Dicoms"):
    dosma_medicalvolume = data.to_medicalvolume()
    dw = DicomWriter()
    # default directory
    data_path = "data/processed/"
    check_and_create_dir(data_path)

    export_path = data_path+file_name+"/"
    check_and_create_dir(export_path)

    dicom_path = export_path+"Dicoms/"
    mat_path = export_path+"Mat/"
    Nifti_path = export_path+"Nifti/"

    # it is much easier to convert dicoms to nifti 
    if type == "Mat" or "All":
        check_and_create_dir(mat_path)
        mat2save = {"data": data[:]}
        savemat(mat_path+"data.mat", mat2save)
    if type != "Mat":
        check_and_create_dir(dicom_path)
        dw.save(dosma_medicalvolume, export_path+"Dicoms/")
    if type == "Nifti" or "All":
        check_and_create_dir(Nifti_path)
        dicom2nifti.convert_directory(dicom_path, Nifti_path)
        if type == "Nifti":
            shutil.rmtree(dicom_path, ignore_errors=True)
    return data
