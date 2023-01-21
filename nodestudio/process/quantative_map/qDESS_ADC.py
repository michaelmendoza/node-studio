import numpy as np
import scipy 
from scipy.linalg import block_diag
import matplotlib.pyplot as plt
import sys
sys.path.insert(1, '../../')
sys.path.insert(1, '../')
from tqdm.notebook import tqdm
import scipy.io as io
from pathlib import Path
import pickle
from glob import glob
import os
def computeEchoesEPG(T1,T2,TR,TE,alpha,G,Tg,D,Ns = 6):
    alpha = np.pi/180*alpha
    gamma = 4258*2*np.pi
    noadd=1
    dk = gamma*G*Tg
    FpFmZ =  np.zeros([3, Ns])
    FpFmZ[:,0]= [0, 0, 1]
    F=FpFmZ
    A1, B1 = epg_sm_rf(alpha,0,Ns)
    
    [FF,EEa,BVa] = epg_grelax(F,T1,T2,TE,dk,D,0,noadd)
    [A2,B2] = epg_sm_grelax(EEa,BVa,D,0)
    
    [FF,EEb,BVb] = epg_grelax(F,T1,T2,(TR-Tg)/2-TE,dk ,D,0,noadd)
    [A3,B3] = epg_sm_grelax(np.copy(EEb),np.copy(BVb),D,0)
    
    [FF,EEc,BVc] = epg_grelax(F,T1,T2,Tg,dk ,D,1,noadd)
    [A4,B4] = epg_sm_grelax(np.copy(EEc),np.copy(BVc),D,1)
    
    [FF,EEd,BVd] = epg_grelax(F,T1,T2,(TR-Tg)/2-TE,dk ,D,0,noadd)
    [A5,B5] = epg_sm_grelax(np.copy(EEd),np.copy(BVd),D,0)
    
    [FF,EEe,BVe] = epg_grelax(F,T1,T2,TE,dk ,D,0,noadd)
    [A6,B6] = epg_sm_grelax(np.copy(EEe),np.copy(BVe),D,0)
    
    AA = A2@A1@A6@A5@A4@A3
    BB = A2@(A1@(A6@(A5@(A4@B3+B4)+B5)+B6)+B1)+B2   
    F1 = np.linalg.solve((np.eye(6*Ns)-AA), BB)
    
    AA1 = A5@A4@A3
    BB1 = A5@(A4@B3+B4)+B5

    F2 = AA1@F1+BB1
    S1 = F1[0]+1j*F1[1]
    S2 = F2[0]+1j*F2[1]
    return S1, S2

def epg_sm_grelax(EE,BV,D,Gon):
    [M,N] = BV.shape
    Em = EE@np.ones([M,N])
    Em = np.concatenate([Em, Em], -1)
    Em = Em.T
    Ar = np.diag(Em.ravel('F'))
    Dm = 0*Em 
    Dm[0,2]=1-EE[2,2]
    Br = Dm.ravel('F')  
    BV = np.stack([BV, BV], -1)
    BV = np.swapaxes(BV, 0, -1)
    Ad = np.diag(np.exp(-(BV.ravel('F')*D)))
    Bd = 0*Br
    tmp = np.eye(2*N-2)
    ud = np.zeros([2*N, 2*N])
    ud[:2*N-2, :2*N-2] = tmp
    ud = np.roll(ud, 2, axis=1)
    ld = ud.T
    A = Ad@Ar
    B = Ad@Br+Bd
    if (Gon):
        Ag = block_diag(*[ld,ud,np.eye(2*N)])
        Ag[0,2*N+2] =1 
        Ag[1,2*N+3] =-1
        A = Ag@A
        B = Ag@B
    return A, B.reshape(-1,1)

def epg_rf(FpFmZ,alpha,phi):
    RR = np.asarray([[(np.cos(alpha/2.))**2., np.exp(2.*1j*phi)*(np.sin(alpha/2.))**2., -1j*np.exp(1j*phi)*np.sin(alpha)],
                    [np.exp(-2.*1j*phi)*(np.sin(alpha/2.))**2., (np.cos(alpha/2.))**2., 1j*np.exp(-1j*phi)*np.sin(alpha)],
                    [-1j/2.*np.exp(-1j*phi)*np.sin(alpha), 1j/2.*np.exp(1j*phi)*np.sin(alpha),      np.cos(alpha)]])
    FpFmZ = RR @ FpFmZ;
    return FpFmZ, RR

def epg_sm_rf(alpha,phi,N):
    F, RR  = epg_rf([0, 0, 0],alpha,phi)
    RR = RR.reshape(1,-1, order = "F").flatten()
    AA = np.zeros([2*N, 2*N, 9])
    for k in range(9):
        a = np.asarray([[RR[k].real, -RR[k].imag],
                        [RR[k].imag, RR[k].real]])
        b = [a] * N
        AA[...,k] = block_diag(*b)    
    A = stitch(AA)    
    B = 0 * A[:,0]
    return A, B.reshape(-1,1)

def epg_grad(FpFmZ,noadd):
    if noadd == 0: 
        FpFmZ = np.concatenate([FpFmZ, np.asarray([0, 0, 0]).reshape(3,1)], -1) 
    FpFmZ[0,:] = np.roll(FpFmZ[0,:], 1, 0)
    FpFmZ[1,:] = np.roll(FpFmZ[1,:], -1, 0)
    FpFmZ[1,-1] = 0
    FpFmZ[0,0] = FpFmZ[1,0].conj()
    return FpFmZ

def epg_grelax(FpFmZ,T1,T2,T,kg,D,Gon,noadd = 0):
    E2 = np.exp(-T/T2);
    E1 = np.exp(-T/T1);
    EE = np.diag([E2, E2, E1])
    RR = [1-E1]
    FpFmZ = EE @ FpFmZ
    FpFmZ[2,0] = FpFmZ[2,0]+RR
    if D is not None: 
        Findex = np.arange(FpFmZ.shape[-1])
        bvalZ = ((Findex)*kg)**2*T
        bvalp = ((( Findex+.5*Gon)*kg)**2+Gon*kg**2/12)*T#;	% for F+ states
        bvalm = (((-Findex+.5*Gon)*kg)**2+Gon*kg**2/12)*T#;	% for F- states
        FpFmZ[0,:] = FpFmZ[0,:] * np.exp(-bvalp*D)#;	% diffusion on F+ states
        FpFmZ[1,:] = FpFmZ[1,:] * np.exp(-bvalm*D)#;	% diffusion on F- states
        FpFmZ[2,:] = FpFmZ[2,:] * np.exp(-bvalZ*D)#;	% diffusion of Z states.
        Bv = np.stack([bvalp, bvalm, bvalZ])
    if Gon == 1: 
        FpFmZ = epg_grad(FpFmZ, noadd)
    return FpFmZ, EE, Bv

def stitch(AA, row = 3, col = 3):
    N, N, ns = AA.shape
    out = np.zeros([N*row, N*col], dtype =AA.dtype)
    for i in range(col):
        for j in range(row):
            out[i*N:(i+1)*N, j*N:(j+1)*N] = AA[...,i+col*j]
    return out
class database(object):
    def __init__(self, TR, TE, Tg, GhArea, GlArea, alpha_deg, bGrid1D, r1Grid2D_alpha, r2Grid2D_alpha,Dvalues, NT2, ND, T1values, T2values):
        self.TR = TR
        self.TE = TE
        self.Tg = Tg
        self.GhArea = GhArea
        self.GlArea = GlArea
        self.alpha_deg = alpha_deg
        self.bGrid1D = bGrid1D
        self.r1Grid2D_alpha = r1Grid2D_alpha
        self.r2Grid2D_alpha = r2Grid2D_alpha
        self.Dvalues = Dvalues
        self.NT2 = NT2
        self.ND = ND
        self.T1values = T1values
        self.T2values = T2values

def create_database(TR,TE,Tg,GhArea,GlArea,alpha_deg):
    Gh = GhArea/(Tg*1e6)*100
    Gl = GlArea/(Tg*1e6)*100
    T1start = 1.15
    T1end = 1.25
    NT1 = 2
    T1values = np.linspace(T1start, T1end, NT1)
    T2start = 0.01
    T2end = 0.08
    NT2 = 70
    T2start = 0.01
    T2end = 0.1
    NT2 = 100
    T2values = np.linspace(T2start, T2end, NT2)
    Dstart = 0.1e-9
    Dend = 6e-9
    ND = 60
    Dvalues = np.linspace(Dstart, Dend, ND)
    Nstates = 6
    gridDataSpH = np.zeros([NT1,NT2,ND], dtype = complex)
    gridDataSmH = np.zeros([NT1,NT2,ND], dtype = complex)
    gridDataSpL = np.zeros([NT1,NT2,ND], dtype = complex)
    gridDataSmL = np.zeros([NT1,NT2,ND], dtype = complex)


    bGrid_alpha_ADC = np.zeros([1,ND], dtype = complex)
    r1Grid2D_alpha = np.zeros([NT2,ND], dtype = complex)
    r2Grid2D_alpha = np.zeros([NT2,ND], dtype = complex)
    for nt1, t1 in enumerate(T1values):
        for nt2, t2 in enumerate(T2values):
            for nd, d in enumerate(Dvalues):
                SpH, SmH = computeEchoesEPG(t1, t2, TR, TE, alpha_deg, Gh, Tg, d, Nstates)
                SpL, SmL = computeEchoesEPG(t1, t2, TR, TE, alpha_deg, Gl, Tg, d, Nstates)
                gridDataSpH[nt1,nt2,nd] = SpH
                gridDataSmH[nt1,nt2,nd] = SmH
                gridDataSpL[nt1,nt2,nd] = SpL
                gridDataSmL[nt1,nt2,nd] = SmL
    bGrid = abs((gridDataSmH*gridDataSpL)/(gridDataSmL*gridDataSpH))
    bGrid1D = np.squeeze(np.mean(np.mean(bGrid,1),0))
    r1Grid = np.abs(gridDataSmH/gridDataSmL)
    r2Grid = np.abs(gridDataSmL/gridDataSpL)
    r1Grid2D_alpha  = np.squeeze(np.mean(r1Grid,0))
    r2Grid2D_alpha = np.squeeze(np.mean(r2Grid,0))
    grid = database(TR, TE, Tg, GhArea, GlArea, alpha_deg, bGrid1D, r1Grid2D_alpha, r2Grid2D_alpha, Dvalues, NT2, ND, T1values, T2values)
    with open(str(TR)+"_"+str(TE)+"_"+str(Tg)+"_"+str(GhArea)+"_"+str(GlArea)+"_"+str(alpha_deg)+'.pkl', 'wb') as outp:
        pickle.dump(grid, outp, pickle.HIGHEST_PROTOCOL)
        
def search_and_load_database(TR,TE,Tg,GhArea,GlArea,alpha_deg):
    files = glob("**/*.pkl", recursive = True)
    database_name = str(TR)+"_"+str(TE)+"_"+str(Tg)+"_"+str(GhArea)+"_"+str(GlArea)+"_"+str(alpha_deg)+'.pkl'
    found = False
    for file in files: 
        current_database = os.path.basename(file)
        if database_name == current_database:
            found = True
            
    if found == False:
        create_database(TR,TE,Tg,GhArea,GlArea,alpha_deg)
        
    with open(database_name, 'rb') as inp:
        database = pickle.load(inp)
        return database
    
    
def find_min_ind_val(tmp):
    ind = np.argmin(tmp)
    m = tmp[ind]
    return m, ind

def DESS2dFit_img(TR,TE,Tg,GhArea,GlArea,alpha_deg,Nstates,e1_H,e2_H,e1_L,e2_L):
    database = search_and_load_database(TR,TE,Tg,GhArea,GlArea,alpha_deg)
    bGrid_alpha_ADC, r1Grid2D_alpha, r2Grid2D_alpha,Dvalues, NT2, ND = database.bGrid1D, database.r1Grid2D_alpha, database.r2Grid2D_alpha, database.Dvalues, database.NT2, database.ND
    T1values, T2values, Dvalues = database.T1values, database.T2values, database.Dvalues
    ny, nx = e1_H.shape
    bMeasured = (e2_H*e1_L)/(e2_L*e1_H)
    r1Measured = np.abs(e2_H/e2_L)
    r2Measured = np.abs(e2_L/e1_L)
    adcFitBieri = np.zeros(e1_H.shape)
    t2Fit2D = np.zeros(e1_H.shape)
    adcFit2D = np.zeros(e1_H.shape)
    
    for y in range(ny):
        for x in range(nx):
            m, ind = find_min_ind_val(np.abs(bMeasured[y,x] - bGrid_alpha_ADC))
            adcFitBieri[y,x] = Dvalues[ind]
            
            r1diffMatrix = (r1Measured[y,x] - np.squeeze(r1Grid2D_alpha)).flatten()
            r2diffMatrix = (r2Measured[y,x] - np.squeeze(r2Grid2D_alpha)).flatten()

            [m,ind2] = find_min_ind_val(np.sqrt(np.abs(r1diffMatrix)**2 + np.abs(r2diffMatrix)**2))
            [nt2,nd] = np.unravel_index(ind2, [NT2,ND], "F")
            t2Fit2D[y,x] = T2values[nt2]
            adcFit2D[y,x] = Dvalues[nd]
    return adcFitBieri,t2Fit2D,adcFit2D

def qDESS_ADC_Bragi_method(TR,TE,Tg,GhArea,GlArea, Alpha_deg,Nstates,e1_H,e2_H,e1_L,e2_L):
    ny, nx, ns = e1_H.shape
    adcFitBieri = np.zeros(e1_H.shape)
    t2Fit2D = np.zeros(e1_H.shape)
    adcFit2D = np.zeros(e1_H.shape)
    for s in tqdm(range(ns)):
        adcFitBieri[s],t2Fit2D[s],adcFit2D[s] = DESS2dFit_img(TR,TE,Tg,GhArea,GlArea, Alpha_deg,Nstates,e1_H[s],e2_H[s],e1_L[s],e2_L[s])
    return adcFit2D

def qDESS_ADC_Bieri_method(TR,TE,Tg,GhArea,GlArea, Alpha_deg,Nstates,e1_H,e2_H,e1_L,e2_L):
    ny, nx, ns = e1_H.shape
    adcFitBieri = np.zeros(e1_H.shape)
    t2Fit2D = np.zeros(e1_H.shape)
    adcFit2D = np.zeros(e1_H.shape)
    for s in tqdm(range(ns)):
        adcFitBieri[s],t2Fit2D[s],adcFit2D[s] = DESS2dFit_img(TR,TE,Tg,GhArea,GlArea, Alpha_deg,Nstates,e1_H[s],e2_H[s],e1_L[s],e2_L[s])
    return adcFitBieri

def qDESS_ADC(scan1, scan2, method, spoiler_duration_ms, gradient_area1, gradient_area2):
    ns, ny, nx = scan1.shape
    dcmheader = scan1.metadata.headers[0]
    TR = dcmheader.RepetitionTime*1e-3
    TE = dcmheader.EchoTime*1e-3
    alpha = dcmheader.FlipAngle
    Tg = float(spoiler_duration_ms) * 10**(-3)
    if gradient_area1 > gradient_area2:
        GhArea, GlArea = float(gradient_area1), float(gradient_area2)
        e1_H = scan1[0:int(ns/2),:,:]
        e2_H = scan1[int(ns/2):,:,:] 
        e1_L = scan2[0:int(ns/2),:,:]
        e2_L = scan2[int(ns/2):,:,:] 
    else:
        GhArea, GlArea = float(gradient_area2), float(gradient_area1)
        e1_H = scan2[0:int(ns/2),:,:]
        e2_H = scan2[int(ns/2):,:,:] 
        e1_L = scan1[0:int(ns/2),:,:]
        e2_L = scan1[int(ns/2):,:,:] 
    if method == "Bragi":
        return qDESS_ADC_Bragi_method(TR,TE,Tg,GhArea,GlArea, alpha,6,e1_H,e2_H,e1_L,e2_L)
    else:
        return qDESS_ADC_Bieri_method(TR,TE,Tg,GhArea,GlArea, alpha,6,e1_H,e2_H,e1_L,e2_L)
    