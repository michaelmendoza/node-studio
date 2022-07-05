
import os 
from pathlib import Path
import numpy as np
import dosma as dm
from matplotlib import pyplot as plt
import os
from dosma.models import IWOAIOAIUnet2DNormalized
from skimage.color import label2rgb
import urllib.request
from core.dataset import NodeDataset 
from core.datagroup import DataGroup

def dosma_segmentation(data, tissuetype):
    '''
    -------------------------------------------------------------------------
    Parameters
    
    filepath: string
    filepath for the dicom files to be segemented
    
    tissue: string 
    only four tissues are currently supported by dicom 
     "fc", "pc", "tc", "men"
            1. Femoral cartilage (fc)
            2. Tibial cartilage (tc)
            3. Patellar cartilage (pc)
            4. Meniscus (men)
    
    -------------------------------------------------------------------------
    Returns
    rss : array-like
    combined image
    
    segmentation :  array-like
    mask
    
    -------------------------------------------------------------------------
    Notes: 
    See the DOSMA documentation, this is only a partice example 
    
    -------------------------------------------------------------------------
    References
    
    [1] 
    Author: Desai, Arjun D et al.
    Title: DOSMA: A deep-learning, open-source framework for musculoskeletal MRI analysis.
    Link: https://dosma.readthedocs.io/en/latest/introduction.html
    
    [2] 
    Author: Desai, Arjun D et al.
    Title: The International Workshop on Osteoarthritis Imaging Knee MRI Segmentation Challenge: 
            A Multi-Institute Evaluation and Analysis Framework on a Standardized Dataset
    Link: https://arxiv.org/abs/2004.14003
    '''
    if tissuetype == "Femoral Cartilage":
        tissuetype = "fc"
    elif tissuetype == "Tibial Cartilage":
        tissuetype = "tc"
    elif tissuetype == "Patellar Cartilage":
        tissuetype = "pc"
    else:
        tissuetype = "men"

    #volumes = dr.load(filepath, group_by="EchoNumbers")
    #dr = dm.DicomReader(num_workers=4, verbose=True)

    if not isinstance(data, DataGroup):
        raise Exception('Input data error: Data must be DataGroup')

    volumes = data.to_medicalvolumes()
    echo1, echo2 = tuple(volumes)
    echo1, echo2 = echo1.astype(np.float), echo2.astype(np.float)
    rss = np.sqrt(echo1 ** 2 + echo2 **2)
    input_shape = rss.shape[:2] + (1,)
    print(input_shape)

    weights_path = "iwoai-2019-unet2d-normalized_fc-tc-pc-men_weights.h5"
    path = os.path.join(Path.cwd(), 'data', weights_path)

    if not os.path.isfile(path):
        print("unet weights not found, dynamic download triggered")
        urllib.request.urlretrieve("https://huggingface.co/arjundd/dosma-models/resolve/main/iwoai-2019-t6-normalized/iwoai-2019-unet2d-normalized_fc-tc-pc-men_weights.h5",
         path)

    # trained using DESS data from the Osteoarthritis Initiative (OAI) iMorphics dataset
    model = IWOAIOAIUnet2DNormalized(input_shape, path)
    outputs = model.generate_mask(rss)
    segmentation = outputs[tissuetype].reformat_as(rss)
    ds = NodeDataset.from_medicalvolume(segmentation)
    return ds #DataGroup([dataset])
    #return segmentation