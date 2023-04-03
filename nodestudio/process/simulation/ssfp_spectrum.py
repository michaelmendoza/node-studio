import base64
from io import BytesIO
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt 
from mssfp.simulations import ssfp
from graph.interfaces import NodeProps, NodeType

def SSFP_SPECTRUM():
    return NodeProps(type=NodeType.SSFP_SPECTRUM,
                     name="ssfp spectrum",
                     tags=['simulation'],
                     description='SSFP spectrum simulator',
                     detail='SSFP spectrum simulation',
                     output=[],
                     options=[],
                     fn=ssfp_spectrum)

def ssfp_spectrum():
    T1, T2 = 1, .5
    TR, alpha = 3e-3, np.deg2rad(30)
    TE = TR / 2.0
    BetaMax = np.pi
    beta = np.linspace(-BetaMax, BetaMax, 100)
    f = beta / TR / (2 * np.pi)
    M = ssfp(T1, T2, TR, TE, alpha, f0=f)[0]

    plt.subplot(211)
    plt.plot(f, np.absolute(M))
    plt.ylabel('Magitude')
    plt.title('SSPF Sequence')
    plt.grid(True)

    plt.subplot(212)
    plt.plot(f, np.angle(M))
    plt.xlabel('Off-Resonance (Hz)')
    plt.ylabel('Phase')
    plt.grid(True)
    
    buffered = BytesIO()
    plt.savefig(buffered, format='png')
    im = Image.open(buffered)
    im.save(buffered, format="PNG")
    return "data:image/png;base64," + base64.b64encode(buffered.getvalue()).decode()
