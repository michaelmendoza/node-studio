import numpy as np

def sum_of_squares(input1,input2):
    if isinstance(input1, np.ndarray) & isinstance(input2, np.ndarray):
        result = input1**2+input2**2
        return result