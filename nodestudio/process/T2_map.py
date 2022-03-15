import os 
import numpy as np
from pathlib import Path
import pydicom as dcm
import math
from numpy import sqrt, sin, cos, pi, exp, log

def qDESS_T2(filePath,tissue):
    #depth, height, width
    
    #--------DICTIONARY--------
    #T1 value dictionary [@1.5T, @3T]
    T1_v = {
        'SciaticNerve': 1.2,
    }

    #Diffusivity dictionary [@1.5T, @3T]
    Diffusivity = {
        'SciaticNerve': 1.25e-9,
    }
    #--------DICTIONARY--------
    
    #------HARDED CODED, CHANGE LATER------
    GlArea = 30*1e2
    spl_dur = 4.8e-3
    #------HARDED CODED, CHANGE LATER------
    
    data = Path(filePath)
    dirs = list(data.glob('**/*.IMA'))
    
    file0 = dcm.read_file(dirs[0]) 
    f = file0.pixel_array
    [height, width] = f.shape
    depth = len(dirs)
    
    T1 = T1_v.get(tissue)
    D = Diffusivity.get(tissue)
    TR = file0.RepetitionTime*1e-3
    TE = file0.EchoTime*1e-3
    alpha = file0.FlipAngle
    Gl = GlArea/(spl_dur*1e6)*100
    gamma = 4258*2*np.pi
    dkL = gamma*Gl*spl_dur
    k = ((math.sin(math.radians(alpha/2))))**2*((1 + exp(-TR/T1 - TR*dkL**2*D)))/(1 - (math.cos(math.radians(alpha)))*exp(-TR/T1 - TR*dkL**2*D))
    c1 = (TR-spl_dur/3)*dkL**2*D
    del file0
    del f
     #depth, height, width
    images = np.zeros([depth,height,width])
    t2map = np.zeros([depth,height,width])
    for index,f in enumerate (dirs):
        image = dcm.read_file(f).pixel_array
        images[index,:,:] = image
    #dess = np.zeros([height,width,int(depth/2),2])
    dess = np.zeros([int(depth/2),height,width,2])
    #dess[:,:,:,0] = images[:,:,0:int(depth/2)]
    dess[:,:,:,0] = images[0:int(depth/2),:,:]
    #dess[:,:,:,1] = images[:,:,int(depth/2):]
    dess[:,:,:,1] = images[int(depth/2):,:,:]
    #mask = np.ones([height,width,int(depth/2)])
    mask = np.ones([int(depth/2),height,width])
    #ratio = np.zeros([height, width, int(depth/2)])
    ratio = np.zeros([int(depth/2),height, width])
    ratio = mask*dess[:,:,:,1]/dess[:,:,:,0]
    t2map = (-2000*(TR-TE)/(log(abs(ratio)/k)+c1))
    
    #------HARDED CODED, CHANGE LATER------
    t2map[np.isnan(t2map)] = 0
    t2map[t2map <= 0] = 0
    t2map[t2map > 100] = 0
    #------HARDED CODED, CHANGE LATER------
    
    return t2map


