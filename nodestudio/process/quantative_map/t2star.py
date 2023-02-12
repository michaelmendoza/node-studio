import scipy.optimize
import scipy as scipy
import numpy as np

def monoExp(TE, A, T2s):
    return A * np.exp(-TE/T2s) 


