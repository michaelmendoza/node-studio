import numpy as np

def sum_of_squares(a,b):
    if isinstance(a, np.ndarray) & isinstance(b, np.ndarray):
        result = a**2+b**2

        min = np.min(result)
        max = np.max(result)
        resolution = 4096
        result = (result - min) * resolution / (max - min)
        result = np.floor(result * resolution).astype('uint16')

        return result