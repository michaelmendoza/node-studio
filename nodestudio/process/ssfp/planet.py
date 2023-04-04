import numpy as np
from skimage.restoration import unwrap_phase
from mssfp.recons import planet
from graph.interfaces import NodeProps, NodeType

def SSFP_PLANET():
    return NodeProps(type=NodeType.SSFP_PLANET, 
                     name="ssfp PLANET", 
                     tags=['ssfp'], 
                     description='ssfp t1/t2 estimator', 
                     detail='SSFP PLANET: T1/T2 Estimator',  
                     input=['dataset', 'tissue'],
                     output=['out'], 
                     options=[], 
                     fn=_planet)

def _planet(dataset, phantom):

    TR = 3e-3
    alpha = np.deg2rad(60)
    
    T1 =  np.squeeze(phantom['t1_map'])
    T2 =  np.squeeze(phantom['t2_map'])
    df =  np.squeeze(phantom['offres'])

    M =  np.squeeze(dataset[:])
    M = np.transpose(M, (2,0,1))
    M = M[...,None]

    M0 =  np.squeeze(phantom['M0'])
    mask = np.abs(M0) > 1e-8
    mask = mask[...,None]

    # Do the thing
    Mmap, T1est, T2est, dfest = planet(M, alpha, TR, mask=mask, pc_axis=0)

    # Look at a single slice
    print(T1est.shape, T2est.shape, dfest.shape, T1.shape, T2.shape, mask.shape)
    sl = 0
    T1est = T1est[..., sl]
    T2est = T2est[..., sl]
    dfest = dfest[..., sl]
    mask = mask[..., sl]

    # Simple phase unwrapping of off-resonance estimate
    dfest = unwrap_phase(dfest*2*np.pi*TR)/(2*np.pi*TR)

    return T1est