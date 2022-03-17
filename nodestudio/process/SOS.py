import numpy as np

def sum_of_squares(a,b):
    if isinstance(a, np.ndarray) & isinstance(b, np.ndarray):
        result = a**2+b**2
        
        return result