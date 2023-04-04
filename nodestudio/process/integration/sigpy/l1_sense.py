import numpy as np
from process.core.fft import *
from core.dataset import NodeDataset
from core.datagroup import DataGroup
from core.metadata import NodeMetadata
from process.recon.SOS import *
from process.core.mask import * 
import process.core.sms_sim as sms
import sigpy as sp
import sigpy.mri as mr
import sigpy.plot as pl

def sigpy_l1_sense(data, ref):
    dataset = data
    coilmap = ref
    mask = dataset.data > 0 
    max_iter = 30
    lamda = 0.005
    lamda = float(lamda)
    recon = np.zeros([dataset.shape[:3]], dtype = complex)
    for slice in range(dataset.shape[0]):
        ksp = dataset[slice, ...]
        ksp = np.moveaxis(ksp, -1, 0)
        mps = np.moveaxis(coilmap, -1, 0)
        recon[slice,...] = L1WaveletRecon(ksp, mask, mps, lamda, max_iter).run()
    ds = NodeDataset(recon, dataset.metadata,recon.shape, 'image')
    return ds

class L1WaveletRecon(sp.app.App):
    def __init__(self, ksp, mask, mps, lamda, max_iter):
        img_shape = mps.shape[1:]
        
        S = sp.linop.Multiply(img_shape, mps)
        F = sp.linop.FFT(ksp.shape, axes=(-1, -2))
        P = sp.linop.Multiply(ksp.shape, mask)
        self.W = sp.linop.Wavelet(img_shape)
        A = P * F * S * self.W.H
        
        proxg = sp.prox.L1Reg(A.ishape, lamda)
        
        self.wav = np.zeros(A.ishape, np.complex)
        alpha = 1
        def gradf(x):
            return A.H * (A * x - ksp)

        alg = sp.alg.GradientMethod(gradf, self.wav, alpha, proxg=proxg, 
                                    max_iter=max_iter)
        super().__init__(alg)
        
    def _output(self):
        return self.W.H(self.wav)