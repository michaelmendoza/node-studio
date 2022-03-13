import numpy as np

#reformats data if not in the corrected format
def reformat(data):
    #reshape data to 3d array
    if len(np.shape(data)) == 2:
        reshaped_data = np.reshape(data,(1,data.shape[0],data.shape[1]))
    
    #normalize and scale data to specified range
    min = np.min(reshaped_data)
    max = np.max(reshaped_data)
    resolution = 4096
    reshaped_data = (reshaped_data - min) * resolution / (max - min)
    reshaped_data = np.floor(reshaped_data).astype('uint16')

    return reshaped_data
