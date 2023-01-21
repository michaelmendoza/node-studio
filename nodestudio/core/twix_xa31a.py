import sys
sys.path.insert(1, '../')
from tqdm.notebook import tqdm
from collections import defaultdict
from copy import copy
from os import remove
import twixtools
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.pyplot as plt
import numpy as np
from scipy import linalg
import math
from tqdm.notebook import tqdm

def ifft(F, axis = (0)):
    x = (axis)
    tmp0 = np.fft.ifftshift(F, axes=(x,))
    tmp1 = np.fft.ifft(tmp0, axis = x)
    f = np.fft.fftshift(tmp1, axes=(x,))
    return f * F.shape[x]

def fft(f, axis = (0)):
    x = (axis)
    tmp0 = np.fft.fftshift(f, axes=(x,))
    tmp1 = np.fft.fft(tmp0, axis = x)
    F = np.fft.ifftshift(tmp1, axes=(x,))
    return F / f.shape[x]

def is_pha_ref_scan(mdb_line):
    return "PHASCOR" in mdb_line.get_active_flags()

def read_image_data(filename):
    out = list()
    for mdb in twixtools.read_twix(filename)[-1]["mdb"]:
        if mdb.is_image_scan():
            out.append(mdb.data)
    return np.asarray(out)  # 3D numpy array [acquisition_counter, n_channel, n_column]
def is_slice_acc_ref_scan(mdb_line):
    return "SLICE_ACCEL_REFSCAN" in mdb_line.get_active_flags() and "PHASCOR" not in mdb_line.get_active_flags()

def is_noise_scan(mdb_line):
    return "NOISEADJSCAN" in mdb_line.get_active_flags()


def is_pat_ref_scan(mdb_line):
    return "PATREFSCAN" in mdb_line.get_active_flags() and "PHASCOR" not in mdb_line.get_active_flags()


def is_online_scan(mdb_line):
    return "ONLINE" in mdb_line.get_active_flags()

def print_mdb(mdb):
    print(0,mdb.cAcq,mdb.cEco,mdb.cLin,mdb.cPar,mdb.cPhs,mdb.cRep,mdb.cSeg,mdb.cSet,mdb.cSlc,mdb.get_active_flags(),sep="\t")

def print_mdb_list(mdb_list):
    for mdb in mdb_list:
        print_mdb(mdb)
        # read image data from list of mdbs and sort into 3d k-space (+ coil dim.)
        
        
def mdb_type(mdb): # file reader is actually complicated... 
    flags = mdb.get_active_flags()
    if "PHASCOR" in flags:
        if "SLICE_ACCEL_REFSCAN" in flags:
            return "SLI_ACS_EPI_NAV"
        if "PATREFSCAN" in flags:
            return "PAT_ACS_EPI_NAV"
        if "SLICE_ACCEL_PHASCOR" in flags:
            return "MB_EPI_NAV"
        return "SB_EPI_NAV"
    if "SLICE_ACCEL_REFSCAN" in flags:
        return "SLICE_ACS"
    if "PATREFSCAN" in flags:
        return "PAT_ACS"
    if "NOISEADJSCAN" in flags:
        return "NOISE"
    return "DATA"        
        
def is_online_scan(mdb):
    return "ONLINE" in mdb.get_active_flags() and "SYNCDATA" not in mdb.get_active_flags()
def is_epi_scan(mdb):
    return "REFLECT" in mdb.get_active_flags()
def is_first_in_slice(mdb):
    return "FIRSTSCANINSLICE" in mdb.get_active_flags()
def is_last_in_slice(mdb):
    return "LASTSCANINSLICE" in mdb.get_active_flags()
def check_axis(cur, key):
    if cur.sli != key.sli:
        return 3
    if cur.par != key.par:
        return 4
    if cur.rep != key.rep:
        return 5        
class UID:
    def __init__(self, mdb):
        self.dtype = mdb_type(mdb)
        self.par = mdb.cPar
        self.rep = mdb.cRep
        self.phs = mdb.cPhs
        self.sli = mdb.cSlc 
        self.traj = None
    def check_UID(self, mdb):
        return mdb_type(mdb) != self.dtype or mdb.cPar != self.par or mdb.cRep  != self.rep or mdb.cPhs != self.phs or mdb.cSlc != self.sli
    def __hash__(self):
        return hash((self.dtype, self.par, self.rep, self.phs, self.sli))
    def __eq__(self, other):
        return self.dtype == other.dtype and self.par == other.par and  self.rep == other.rep and self.phs == other.phs and self.sli == other.sli
    def __str__(self):
        return  " sli: "+ str(self.sli) +" par: "+  str(self.par) + " rep: "+  str(self.rep) + " phs: "+ str(self.phs) + " dtype: "+ self.dtype        
def nav_loader(key, mdb_list, prewhitening = None):
    # I only expect three in this list
    Mpos, Mneg = key.traj
    names = [str(key)]
    images = [mdb_list]
    for name, images_list in zip(names, images):
        starting_nslices = min([mdb.cSlc for mdb in images_list])
        starting_lines = min([mdb.cLin for mdb in images_list])
        nlin = 1 + max([mdb.cLin for mdb in images_list]) + starting_lines
        npar = 1 + max([mdb.cPar for mdb in images_list])
        nsli = len(images_list)//3
        nrep = 1 + max([mdb.cRep for mdb in images_list])
        ncha = images_list[0].data.shape[0]
        ncol = images_list[0].data.shape[1]
        out = np.zeros([3, ncol//2, ncha], dtype=complex)
        flag = []
        numNavigator = {} # the navigator is acquired without phase encoding, so the data will override.
        for sli in range(nsli):
            numNavigator[sli] = 0
        indslice = 0 
        for idx, mdb in enumerate(images_list):
            data = mdb.data
            if prewhitening is not None: 
                data = prewhitening@data
            data = np.moveaxis(data, 0, 1)
            if "REFLECT" in mdb.get_active_flags():            
                data = Mneg@data
                flag.append(1)
            else:
                data = Mpos@data
                flag.append(0)
            out[numNavigator[indslice],:,:] = fft(data,0)
            numNavigator[indslice] += 1
            if numNavigator[indslice] == 3: 
                indslice += 1
    return {"readouts": out, "flags":np.asarray(flag).astype(int)}

class log:
    def __init__(self, ny, nx, nc):
        self.maxpar = 0
        self.maxrep = 0
        self.maxphs = 0
        self.maxsli = 0
        self.ny = ny
        self.nx = nx
        self.nc = nc
class datalogger:
    def __init__(self):
        self.logs = {}
    def log(self, UID, ny, nx , nc):
        if UID.dtype not in self.logs.keys():
            self.logs[UID.dtype] = log(ny, nx, nc)
        self.logs[UID.dtype].maxpar = max(self.logs[UID.dtype].maxpar, UID.par)
        self.logs[UID.dtype].maxsli = max(self.logs[UID.dtype].maxsli, UID.sli)
        self.logs[UID.dtype].maxrep = max(self.logs[UID.dtype].maxrep, UID.rep)
        self.logs[UID.dtype].maxphs = max(self.logs[UID.dtype].maxphs, UID.phs)
def data_loader(key, mdb_list, prewhitening = None):
    if key.traj is not None:
        Mpos, Mneg = key.traj
    names = [str(key)]
    images = [mdb_list]
    for name, images_list in zip(names, images):
        flag = []
        #print(names)
        starting_nslices = min([mdb.cSlc for mdb in images_list])
        starting_lines = min([mdb.cLin for mdb in images_list])
        nlin = 1 + max([mdb.cLin for mdb in images_list]) + starting_lines
        npar = 1 + max([mdb.cPar for mdb in images_list])
        nsli = 1 + max([mdb.cSlc for mdb in images_list]) - starting_nslices
        nrep = 1 + max([mdb.cRep for mdb in images_list])
        ncha = images_list[0].data.shape[0]
        ncol = images_list[0].data.shape[1]
        out = np.zeros([nlin, ncol//2, ncha], dtype=complex)
        for mdb in images_list:
            data = mdb.data
            if prewhitening is not None: 
                data = prewhitening@data
            data = np.moveaxis(data, 0, 1)
            if "REFLECT" in mdb.get_active_flags():
                if key.traj is not None:
                    data = Mneg@data
                    data = fft(data,0)
                else:
                    data = readout_trim(data[::-1,:])
                flag.append(1)
            else:
                if key.traj is not None:
                    data = Mpos@data
                    data = fft(data,0)
                else:
                    data = readout_trim(data)
                flag.append(0)
            out[mdb.cLin,:,:] += data
    return {"readouts": out,  "flags":np.asarray(flag).astype(int)}

def readtwix(filepath, prewhitening = True,v=0):
    twixfile = twixtools.read_twix(filepath)
    if prewhitening is not None:
        prewhitening = noise_prewhitening(twixfile)
    hdr = twixfile[-1]['hdr']
    mdb_list = twixfile[1]['mdb']
    # sort the data 
    file = {}
    tmp = []
    for mdb in mdb_list:
        if is_online_scan(mdb):
            ID = UID(mdb)
            break;
    is_EPI = False
    print("-"*100)
    print("reading raw data, calculating trajectories and sampling raster ")
    traj = {}
    for mdb in tqdm(mdb_list):
        if is_online_scan(mdb):
            if v:
                print_mdb(mdb)
            if (ID.check_UID(mdb)):
                if is_EPI:
                    if mdb.mdh["fReadOutOffcentre"] not in traj.keys():
                        traj[mdb.mdh["fReadOutOffcentre"]] = epi_traj(hdr, mdb.mdh["fReadOutOffcentre"])
                    ID.traj = traj[mdb.mdh["fReadOutOffcentre"]]
                file[ID] = tmp
                tmp = []
                ID = UID(mdb)
            if is_epi_scan(mdb):
                is_EPI = True
            tmp.append(mdb)
    if is_EPI:
        ID.traj = epi_traj(hdr, mdb.mdh["fReadOutOffcentre"])
    file[ID] = tmp
    print("-"*100)
    print("file parsed")
    if v: 
        print("the scans detected in sequential order are: ")
        for key in file.keys():
            print(key.dtype)
        
    print("-"*100)
    print("loading and preprocessing the data..")
    collection = {}
    logger = datalogger()
    for key in file.keys():
        if key.dtype == "SLI_ACS_EPI_NAV" or key.dtype == "PAT_ACS_EPI_NAV" or key.dtype == "MB_EPI_NAV" or key.dtype == "SB_EPI_NAV":
            collection[key] = nav_loader(key, file[key], prewhitening)
            ny, nx, nc = collection[key]['readouts'].shape
            logger.log(key, ny, nx, nc)
        else: 
            collection[key] = data_loader(key, file[key], prewhitening)
            ny, nx, nc = collection[key]['readouts'].shape
            logger.log(key, ny, nx, nc)
    if v:
        for idx, key in enumerate (collection.keys()):
            print(str(key))
    del file
    
    # dynamic combine
    print("-"*100)
    print("dynamically combining data according to dtype, sli, par, rep..")
    output = {}
    for key in logger.logs.keys():
        ID = logger.logs[key]
        output[key] = {"readouts": np.zeros([ID.ny, ID.nx, ID.nc, ID.maxsli+1, ID.maxrep+1, ID.maxpar+1, ID.maxphs+1], dtype= complex),  "flags":np.zeros([ID.ny, ID.maxsli+1, ID.maxrep+1, ID.maxpar+1, ID.maxphs+1])}

    for key in tqdm(list(collection.keys())):
        output[key.dtype]['readouts'][:,:,:,key.sli, key.rep, key.par, key.phs] = collection[key]['readouts']
        output[key.dtype]['flags'][:len(collection[key]['flags']),key.sli, key.rep, key.par, key.phs] = collection[key]['flags']
            
    print("-"*100)
    print("finished, the output is stored in a list format and each element of the list is a dictionary.")
    print("To access the data, use file[idx][\"readout\"] or file[idx][\"flags\"]")
    print(" "*100)
    print("idx", " file type")
    for idx, key in enumerate (output.keys()):
        output[key]['readouts'] = np.squeeze(output[key]['readouts'])
        output[key]['flags'] = np.squeeze(output[key]['flags'])
        print(idx," " ,key)
    return list(output.values())            

# lazy approach...
def noise_prewhitening(twixfile, debug = 0 ,v = 0):
    if v: print("ID", "Acq", "Eco", "Lin", "Par", "Phs", "Rep", "Seg", "Set", "Slc", "Tags", sep="\t")
    mdbs = []
    bool_data = 0
    mdb_list = twixfile[0]['mdb']
    # t_dwell_noise = twixfile[0]['hdr']['Meas']['alDwellTime'][0]
    # t_dwell_acq = twixfile[1]['hdr']['Meas']['alDwellTime'][0]
    scale_factor =  0.793 #t_dwell_acq / t_dwell_noise *
    for mdb in mdb_list:
        if is_noise_scan(mdb):
            if v: print_mdb(mdb)
            mdbs.append(mdb)
            
            bool_data = 1
            
    names = []
    images = []
    if bool_data:
        names.append("noise")
        images.append(mdbs)
   
    file = {}
    for name, images_list in zip(names, images):
        flag = []
        starting_nslices = min([mdb.cSlc for mdb in images_list])
        starting_lines = min([mdb.cLin for mdb in images_list])
        nlin = 1 + max([mdb.cLin for mdb in images_list]) + starting_lines
        npar = 1 + max([mdb.cPar for mdb in images_list])
        nsli = 1 + max([mdb.cSlc for mdb in images_list]) - starting_nslices
        nrep = 1 + max([mdb.cRep for mdb in images_list])
        ncha = images_list[0].data.shape[0]
        ncol = images_list[0].data.shape[1]
        out = np.zeros([nsli, npar, nlin, nrep, ncha, ncol], dtype=complex)
        counter = defaultdict(int)
        for mdb in images_list:
            counter[f"{mdb.cSlc}-{mdb.cPar}-{mdb.cLin}-{mdb.cRep}"] += 1
            data = mdb.data
            out[mdb.cSlc - starting_nslices, mdb.cPar, mdb.cLin, mdb.cRep] += data
            flag.append(0)
        file[name] = {"readouts": out, "counter": counter, "flags":np.asarray(flag)}
    noise = file['noise']['readouts']
    noise = np.squeeze(noise)
    noise = np.moveaxis(noise, 1, 0)
    [nc, ny, nx]= noise.shape
    ne = np.prod(noise.shape)//nc
    noise = noise.reshape(nc, -1)
    psi = 1 / ne * (noise @ noise.conj().T)
    L = np.linalg.cholesky(psi)/np.sqrt(2*scale_factor)
    Linv = np.linalg.inv(L)
    if debug: 
        return Linv, file
    else:
        return Linv
    

def siemens_readout_trim(F):
    [ny,nx,] = F.shape[:2]
    f = ifft(F,1)
    f = f[:,nx//4:nx-nx//4,...]
    return fft(f, 1)

def readout_trim(F):
    [nx,nc] = F.shape
    f = ifft(F,0)
    f = f[nx//4:nx-nx//4,...]
    return fft(f, 0)


# from gadgetron epi gadget translated from c++

# gagdetron: using sinc interpolation 
# mapVBVD: using cubic spline interpolation 
# twixtool using linear interpolation 
def epi_traj(hdr, roOffCenterDistance):
    meas = hdr["Meas"]
    numSamples = meas['alRegridDestSamples'][0]
    dwellTime = meas['aflRegridADCDuration'][0] / numSamples
    rampUpTime = meas['alRegridRampupTime'][0]
    flatTopTime = meas['alRegridFlattopTime'][0]
    rampDownTime = meas['alRegridRampdownTime'][0]
    acqDelayTime = meas['alRegridDelaySamplesTime'][0]
    reconNx = numSamples //2
    encodeNx = numSamples //2
    encodeFOV = hdr['Config']['ReadFoV']
    totTime = rampUpTime + flatTopTime + rampDownTime
    readTime = dwellTime * numSamples
    totArea = 0.5*rampUpTime + flatTopTime + 0.5*rampDownTime
    readArea =  0.5*rampUpTime + flatTopTime + 0.5*rampDownTime
    if (rampUpTime > 0.0):
        readArea =  readArea - 0.5*(acqDelayTime)*(acqDelayTime)/rampUpTime
    if (rampDownTime > 0.0):
        readArea = readArea - 0.5*(totTime - (acqDelayTime+readTime))*(totTime - (acqDelayTime+readTime))/rampDownTime
    prePhaseArea = 0.5 * totArea
    scale = encodeNx /readArea
    trajectoryPos=np.zeros([numSamples,1])
    trajectoryNeg=np.zeros([numSamples,1])
    k = np.zeros([numSamples,1])
    for n in range(numSamples):
        t = (n+1.0)*dwellTime + acqDelayTime
        if (t <= rampUpTime):
            k[n] = 0.5 / rampUpTime * t*t

        elif ((t > rampUpTime) and (t <= (rampUpTime+flatTopTime))):
            k[n] = 0.5*rampUpTime + (t - rampUpTime)
        else:
            v = (rampUpTime+flatTopTime+rampDownTime-t)
            k[n] = 0.5*rampUpTime + flatTopTime + 0.5*rampDownTime - 0.5/rampDownTime*v*v
    for n in range(numSamples):
        trajectoryPos[n] = scale * (k[n] - prePhaseArea);
        trajectoryNeg[n] = scale * (-1.0*k[n] + totArea - prePhaseArea);
        #print(n,trajectoryPos[n], trajectoryNeg[n])
    Km = int(np.floor(encodeNx / 2.0))
    Ne = 2*Km + 1
    Mpos=np.zeros([reconNx,numSamples], dtype = complex)
    Mneg=np.zeros([reconNx,numSamples], dtype = complex )
    keven = np.linspace(-Km, Km, Ne)
    # print(keven)
    x = np.linspace(-0.5,(reconNx-1)/(2.*reconNx),reconNx)
    F=np.zeros([reconNx, Ne], dtype = complex)
    fftscale = 1.0 / np.sqrt(Ne);

    for p in range(reconNx):
        for q in range(Ne):
            F[p,q] = fftscale * np.exp(complex(0.0,1.0*2*np.pi*keven[q]*x[p]))
    Qp=np.zeros([numSamples, Ne])
    Qn=np.zeros([numSamples, Ne])
    for p in range(numSamples):
        for q in range(Ne):
            Qp[p,q] = np.sinc(trajectoryPos[p]-keven[q])
            Qn[p,q] = np.sinc(trajectoryNeg[p]-keven[q])
    Mp=np.zeros([reconNx,numSamples], dtype = complex)
    Mn=np.zeros([reconNx,numSamples], dtype = complex)
    Mp = F @ linalg.pinv(Qp)
    Mn = F @ linalg.pinv(Qn)
    my_keven = np.linspace(0, numSamples -1, numSamples)
    trajectoryPosArma = trajectoryPos
    n = np.abs(trajectoryPosArma - 0).argmin()
    my_keven = my_keven - (n-1)
    Delta_k = abs( trajectoryPosArma[1:numSamples] - trajectoryPosArma[0:numSamples-1])
    my_keven = my_keven *max(Delta_k)
    myExponent = np.zeros([numSamples,1])
    for l in range (trajectoryPosArma.shape[0]):
        myExponent[l]=np.imag(2*np.pi*roOffCenterDistance/encodeFOV*(trajectoryPosArma[l]-my_keven[l]))
    offCenterCorrN = np.exp( myExponent )
    for l in range (trajectoryPosArma.shape[0]):
        myExponent[l]=np.imag(2*np.pi*roOffCenterDistance/encodeFOV*(trajectoryNeg[l]+my_keven[l] ))
    offCenterCorrP = np.exp( myExponent )
    Mp = Mp * np.diag(offCenterCorrP)
    Mn = Mn * np.diag(offCenterCorrN)
    for p in range(reconNx):
        for q in range (numSamples):
            Mpos[p,q] = Mp[p,q]
            Mneg[p,q] = Mn[p,q]
    return Mpos, Mneg


def epi_invert(data, dataflag):
    ny = data.shape[0]
    if dataflag[0]:
        dataflag = np.abs(1 - dataflag)
    for y in range(ny):
        if dataflag[y]:
            data[y,...] = data[y,::-1,...]
    return data