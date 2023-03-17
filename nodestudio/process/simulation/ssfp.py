import math
import numpy as np
from tqdm import tqdm
from graph.interfaces import NodeProps
from graph.enums import NodeType, NodeDetail
from mssfp.simulations import ssfp, add_noise_gaussian

def SSFP():
    return NodeProps(type=NodeType.SSFP, 
                    name="ssfp", 
                    tags=['simulation'], 
                    description='ssfp simulator', 
                    detail=NodeDetail.SSFP, 
                    input=['tissue'],
                    output=['out'], 
                    options=['phase_cyles'], 
                    fn=_ssfp)

def _ssfp(tissue, phase_cyles, TR = 3e-3, TE = 3e-3, alpha = np.deg2rad(15), sigma=0):

    npcs = int(phase_cyles) # TODO: check for int 
    data = tissue['raw']
    M0 = tissue['M0']
    T1 = tissue['t1_map']
    T2 = tissue['t2_map']
    df = tissue['offres']

    # Simulation SSFP with phantom data 
    dataset = []
    pcs = np.linspace(0, 2 * math.pi, npcs, endpoint=False)
    for i in tqdm(range(data.shape[0])):
        M = ssfp(T1[i, :, :], T2[i, :, :], TR, TE, alpha, field_map=df[i, :, :], dphi=pcs, M0=M0[i, :, :])
        M = add_noise_gaussian(M, sigma=sigma)
        dataset.append(M[None, ...])
    dataset = np.concatenate(dataset, axis=0)

    #from mssfp.plots import plot_dataset
    #plot_dataset(dataset, slice=0)

    return dataset
