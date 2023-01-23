import numpy as np
from nodestudio.process.core.fft import fft1c, ifft1c, fft2c, ifft2c 
import math
from scipy.linalg import pinv
from nodestudio.core.datagroup import DataGroup
from nodestudio.core.dataset import NodeDataset 
from nodestudio.process.recon.SOS import *


flags_for_undersampling = ["PATREFSCAN"]

def auto_recon(datagroup):
    if type(datagroup) is not DataGroup: 
        raise Exception("Not a data group")

    flags = datagroup.keys()
    if "DATA" not in flags:
        raise Exception("No data availble for the operation")
    

    if "SLICE_ACCEL_REFSCAN" in flags:
        # sms recon 

    elif "PATREFSCAN" in flags:
        # in plane recon 
    
    else:
        # check for partial fourier  

    