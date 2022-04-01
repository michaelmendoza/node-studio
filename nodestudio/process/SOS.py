import numpy as np

def sum_of_squares(a,b):
    if isinstance(a, np.ndarray) & isinstance(b, np.ndarray):
        result = a**2+b**2
        
        return result

def complex_root_sum_of_squares(input):
    result= np.sqrt(np.sum((input*1j*input), axis=2))

    return result
