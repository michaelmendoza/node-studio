from enum import Enum

class NodeType(Enum):
    # Variable Nodes
    VARIABLE = 'VARIABLE'

    # Input Nodes
    FILE = 'FILE'
    FILE_OLD = 'FILE_OLD'
    FILE_RAWDATA = 'FILE_RAWDATA'
    MOCK = 'MOCK'

    # Generator Nodes
    MASK_GENERATOR = 'MASK_GENERATOR'
    SHAPE_GENERATOR = 'SHAPE_GENERATOR'
    PHANTOM = "PHANTOM"

    # Filter Nodes
    MASK = 'MASK'
    THRESHOLD_MASK = 'THRESHOLD_MASK'

    # Computer Nodes
    ADD = 'ADD'
    MULT = 'MULT'
    FIT = 'FIT'
    SOS = 'SOS'
    CRSOS = 'CRSOS'
    T2_qDESS = 'T2_qDESS'
    GRAPPA = 'GRAPPA'
    SENSE = 'SENSE'
    UNDERSAMPLE = 'UNDERSAMPLE'
    SENSITIVITY_MAP = 'SENSITIVITY_MAP'
    DOSMA_QDESS = "DOSMA_QDESS"
    CGSENSE = "CGSENSE"
    FFT = "FFT"
    
    # Output Nodes
    DISPLAY = 'DISPLAY'
    LINE_DISPLAY = 'LINE_DISPLAY'
    LAYER_DISPLAY = 'LAYER_DISPLAY'
    HISTOGRAM = 'HISTOGRAM'

    # Debug Nodes
    DELAY = 'DELAY'
    ERROR = 'ERROR'

class NodeDetail(Enum):
    BLANK = ''

    # Variable Nodes
    VARIABLE = ''' Variable Detail '''

    # Input Nodes
    FILE = ''' # File 
    Node for accessing file data. 
    Supports dicom and raw file data. 
    '''
    MOCK = '''MOCK detail'''
    PHANTOM = "PHANTOM_GENERATOR"   
    
    # Generator Nodes
    MASK_GENERATOR = 'MASK_GENERATOR detail'
    SHAPE_GENERATOR = 'SHAPE_GENERATOR detail'

    # Filter Nodes
    MASK = '''MASK detail'''
    THRESHOLD_MASK = 'THRESHOLD_MASK detail'

    # Computer Nodes
    ADD = '''ADD detail'''
    MULT = '''MULT detail'''
    FIT = '''FIT detail'''
    SOS = '''any string
    $$
    SOS = a^2 + b^2
    $$
    So it's still a bit buggy - only a certain combo is allowed hmmm...
    '''
    CRSOS = '''Coil combination algorithm takes a collection of coil images and produces a weighted combination. The coil combination module in adopted the most commonly used root sum of squares (RSOS) method to preserve signal to noise ratio (SNR) without requiring detailed information about the magnetic field for each coil'''
    T2_qDESS = '''The QDESS T2 mapping module is able to compute pixel wise T2 values (an intrinsic tissue parameter) analytically using dicom images acquired at multiple echo times(TE). Applying a threshold on the set of T2 values allows quantitative mapping of a specific tissue.'''
    GRAPPA = '''The GRAPPA module realises a k-space domain reconstruction, whose inputs are undersampled k-space data where every few rows are skipped except for the centre, known as the auto-calibration signal. The spatial harmonics in a local k-space can be obtained from the ACS region and enables filling the unsampled region in k-space using linear interpolation. '''
    SENSE = '''SENSE allows is an common image domain based reconstruction algorithm. The input to both algorithms is undersampled k-space data where every few rows are skipped. SENSE uses the prior knowledge of the sensitivity profile as additional spatial encoding to ‘unfold’ the aliased image'''
    UNDERSAMPLE = '''For testing of the parallel imaging plugins as well as potential educational needs, an undersampling module was developed to reproduce aliasing artefacts resulting from direct inverse fourier transform of undersampled k-space data. As each parallel imaging method was designed for a particular undersampling pattern, the module incorporates undersampling trajectories for each technique and can be selected by the user upon running the app.'''
    SENSITIVITY_MAP = '''Sensitivity maps are used for sense, and can be obtained from dicom images'''
    DOSMA_QDESS = "Dosma implementation of the qDESS T2 mapping, see T2_qDESS(identical algorithm)"
    CGSENSE = "An optimised reconstruction plugin of SENSE, cgSENSE, was also included, where cg stands for conjugate gradient. By using the forward model, computation speed can be reduced from O(N^3) to O(NlogN) compared to regular SENSE, with N being the number of iterations performed."
    FFT = "Fourier transforma and inverse Fourier transform"

    # Output Nodes
    DISPLAY = '''DISPLAY detail'''
    LINE_DISPLAY = 'LINE_DISPLAY'
    LAYER_DISPLAY = 'LAYER_DISPLAY detail'
    HISTOGRAM = 'HISTOGRAM detail'

    # Debug Nodes
    DELAY = 'Adds a time delay'
    ERROR = 'Purposely throws an error'