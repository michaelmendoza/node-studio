import sys
import torch
import numpy as np
from mirtorch.alg import CG, FISTA, POGM, power_iter, FBPD
from mirtorch.linear import LinearMap, FFTCn, NuSense, Sense, FFTCn, Identity, Diff2dgram, Diff3dgram, Gmri, Wavelet2D, Diffnd
from mirtorch.prox import Prox, L1Regularizer, Const
import matplotlib.pyplot as plt
import copy
import h5py
import torchkbnufft as tkbn
import time
from core.dataset import NodeDataset 
def MRITorch_compressed_sensing(datagroup, method, device):

    data = datagroup["rawdata"].data
    cmap = datagroup["reference"].data
    [ns, ny, nx, nc] = data.shape
    if device == "cpu":
        device0 = torch.device('cpu')
    else: 
        device0 = torch.device('gpu')
    
    reconset = NodeDataset(None, datagroup["rawdata"].metadata, datagroup["rawdata"].dims, "image")
    recon = np.zeros([ns, ny, nx])
    for sli in range(ns):
        s_c = np.swapaxes(cmap[sli], 2, 0)
        k_c = np.swapaxes(data[sli], 2, 0)
        mask = np.ones([nc, ny, nx])
        mask[np.abs(k_c) == 0] = 0
        mask = np.sum(mask, 0)
        mask = mask.astype("float32")
        mask = torch.tensor(mask).to(device0)
        k_c = torch.tensor(k_c).to(device0)
        s_c = torch.tensor(s_c).to(device0)

        (nc, nh, nw) = s_c.shape
        Fop = FFTCn((nc, nh, nw), (nc, nh, nw), (1,2), norm = 'ortho')
        I1 = (Fop.H*k_c).to(torch.complex64).unsqueeze(0)
        I1 = I1[:,:,nh//2-nx//2:nh//2+nx//2,nw//2-ny//2:nw//2+ny//2]
        s_c = s_c[:,nh//2-nx//2:nh//2+nx//2,nw//2-ny//2:nw//2+ny//2].unsqueeze(0).to(torch.complex64)
        

        Fop = FFTCn((1, nc, nx, ny), (1, nc, nx, ny), (2,3), norm = 'ortho')
        K1 = Fop*I1
        # A'y
        Sop = Sense(s_c, mask.unsqueeze(0))
        I0 = Sop.H*K1
        
        W = Wavelet2D(I0.shape, padding='periodization', J=2, wave_type = 'db4')
        L = power_iter(Sop, torch.randn_like(I0), max_iter=200)
        wv_weights = 1e-5
        P = L1Regularizer(wv_weights, T = W)
        def gradA(x):
            return Sop.H*Sop*x-I0
        def evalation(x):
            return (torch.norm(Sop*x-K1)**2).item()+wv_weights*torch.norm(P(x,1), p=1).item()
        if method == "POGM":
            [pg_wavelet, loss_pg_wavelet] = POGM(f_grad=gradA, f_L=L[1].item()**2, g_prox=P, max_iter=100, eval_func=evalation).run(x0=I0)
            recon[sli] = torch.abs((pg_wavelet[0,0,:,:])).cpu().data.numpy()
        # if method == "FBPD":
        #     [fbpd_wavelet, loss_fbpd_wavelet] = FBPD(gradA, f_prox, P, L[1].item()**2, 1, G=W, max_iter=200, eval_func=evalation).run(torch.zeros_like(I0))
        #     recon[sli] = torch.abs((fbpd_wavelet[0,0,:,:])).cpu().data.numpy()
    reconset.data = recon
    return reconset


