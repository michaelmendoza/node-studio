import numpy as np
#from process.reformat import reformat

def sum_of_squares(a,b):
    if isinstance(a, np.ndarray) & isinstance(b, np.ndarray):
        result = a**2+b**2
        
        return result