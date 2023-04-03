import numpy as np
from tqdm import tqdm
from  mssfp.recons import gs_recon, rsos
from graph.interfaces import NodeProps, NodeType

def SSFP_BAND_REMOVAL():
    ''' NodeProp for SSFP_BAND_REMOVAL: Removes banding artifacts from SSFP images '''

    options = [{'name':'type', 'default': 'SOS', 'select':['SOS', 'Elliptical Signal Model']}]

    return NodeProps(type=NodeType.SSFP_BAND_REMOVAL, 
                     name="SSFP band removal", 
                     tags=['ssfp'], 
                     description='ssfp simulator', 
                     detail='', 
                     input=['dataset'],
                     output=['out'], 
                     options=options, 
                     fn=band_removal)

def band_removal(dataset, type: str):
    ''' Removes banding artifacts from SSFP images. 
    
    Args:
        type: specified algorithm used for band removal 
    '''

    _dataset = dataset[:]
    
    if type == 'SOS':
        results = elliptical_band_removal(_dataset)
    elif type == 'Elliptical Signal Model':
        results = rsos(_dataset)
    return results

def elliptical_band_removal(dataset):
    ''' Removes banding artifacts with Elliptical Signal Model '''
    results = []
    for i in tqdm(range(dataset.shape[0])):
        recon = gs_recon(dataset[i], pc_axis=2)
        results.append(recon[None, ...])
    results = np.concatenate(results, axis=0)

    return results

def debug(results):
    ''' Plotting debug '''
    
    import matplotlib.pyplot as plt
    plt.figure()
    plt.imshow(np.abs(results[0]), cmap='gray')
    plt.title('Reconstructed Image')
    plt.xticks([])
    plt.yticks([])
    plt.show()