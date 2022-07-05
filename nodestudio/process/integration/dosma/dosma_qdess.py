import numpy as np
from dosma.scan_sequences import QDess
from dosma.tissues import FemoralCartilage, TibialCartilage, PatellarCartilage, Meniscus
from core.datagroup import DataGroup
from core.dataset import NodeDataset 

def dosma_qDessT2mapping(data, tissuetype, lowerBound = 0, upperBound = 80):
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
    
    lowerBound: scalar
    lower bound for the t2 mapping
    
    
    upperBound: scalar
    upper bound for the t2 mapping
    
    -------------------------------------------------------------------------
    Returns
    t2map : array-like
    t2 map
    
    -------------------------------------------------------------------------
    Notes: 
    See the DOSMA documentation, this is only a partice example
    If I'm not crazy, DOSMA qDESS T2 mapping used same algorithm as qDESS_T2
    So idealy, they should display the same result, unless I'm missing something  
    
    -------------------------------------------------------------------------
    References
    
    [1] 
    Author: Desai, Arjun D et al.
    Title: DOSMA: A deep-learning, open-source framework for musculoskeletal MRI analysis.
    Link: https://dosma.readthedocs.io/en/latest/introduction.html
    
    [2] 
    Author: B Sveinsson et al. 
    Title: A Simple Analytic Method for Estimating T2 in the Knee from DESS
    Link: https://www.ncbi.nlm.nih.gov/pubmed/28017730
    
    '''
    qdess = []
    try: 
        qdess = data.to_QDess()
    except:
        raise Exception("Error when converting datagroup to dosma qdess sequence")

    # read metadata -> we need to consider how to deal with this
    #metadata = data[0].metadata
    #dims = data[0].dims

    if tissuetype == "Femoral Cartilage":
        t = FemoralCartilage()
    elif tissuetype == "Tibial Cartilage":
        t = TibialCartilage()
    elif tissuetype == "Patellar Cartilage":
        t = PatellarCartilage()
    else:
        t = Meniscus()
    
    t2map = qdess.generate_t2_map(t, suppress_fat=True, suppress_fluid=True)
    t2map.volumetric_map = np.clip(t2map.volumetric_map, int(lowerBound), int(upperBound))
    #dataset = NodeDataset(t2map.volumetric_map.A, metadata , dims, "quantitiveMapping")
    ds = NodeDataset.from_medicalvolume(t2map.volumetric_map)
    return ds #DataGroup([dataset])