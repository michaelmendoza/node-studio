from enum import Enum

class NodeType(Enum):
    # Variable Nodes
    VARIABLE = 'VARIABLE'

    # Input Nodes
    FILE = 'FILE'
    FILE_OLD = 'FILE_OLD'
    FILE_RAWDATA = 'FILE_RAWDATA'
    MOCK = 'MOCK'
    GROUP_BY = 'GROUP_BY'

    # Generator Nodes
    MASK_GENERATOR = 'MASK_GENERATOR'
    SHAPE_GENERATOR = 'SHAPE_GENERATOR'
    PHANTOM = "PHANTOM"
    TISSUE = 'TISSUE'

    # Simulation Nodes
    SSFP = 'SSFP'
    SSFP_SPECTRUM = 'SSFP_SPECTRUM'

    # SSFP Nodes
    SSFP_BAND_REMOVAL = 'SSFP_BAND_REMOVAL'
    SSFP_PLANET = 'SSFP_PLANET'
    SSFP_SFOV = 'SSFP_SFOV'

    # Filter Nodes
    MASK = 'MASK'
    THRESHOLD_MASK = 'THRESHOLD_MASK'

    # Compute Nodes
    ADD = 'ADD'
    MULT = 'MULT'
    FIT = 'FIT'
    SOS = 'SOS'
    CRSOS = 'CRSOS'
    T2_qDESS = 'T2_qDESS'
    GRAPPA = 'GRAPPA'
    SENSE = 'SENSE'
    UNDERSAMPLE = 'UNDERSAMPLE'
    RESIZE = 'RESIZE'
    SENSITIVITY_MAP = 'SENSITIVITY_MAP'
    DOSMA_TEST = "DOSMA_TEST"
    DOSMA_QDESS = "DOSMA_QDESS"
    DOSMA_SEGMENTATION = "DOSMA_SEGMENTATION"
    CGSENSE = "CGSENSE"
    FFT = "FFT"
    QDESS_ADC = "QDESS_ADC"
    MIRTorch_CS = "MIRTorch_CS"
    PARTIAL_FOURIER = "PARTIAL_FOURIER"
    SMS_RECON = "SMS_RECON"
    MTR = "MTR"
    
    # Output Nodes
    DISPLAY = 'DISPLAY'
    LINE_DISPLAY = 'LINE_DISPLAY'
    LAYER_DISPLAY = 'LAYER_DISPLAY'
    HISTOGRAM = 'HISTOGRAM'
    EXPORT_FILE = 'EXPORT_FILE'
    
    # Debug Nodes
    DELAY = 'DELAY'
    ERROR = 'ERROR'

class NodeDetail(Enum):
    BLANK = ''

    # Variable Nodes
    VARIABLE = ''' Variable Detail '''

    # Input Nodes
    FILE = ''' File Node for accessing loaded file data. Supports dicom and raw file data. '''
    MOCK = '''MOCK detail'''
    GROUP_BY = 'Data Aggregation node for grouping dicom files. For example GROUP_BY: "EchoNumber" will create a datagroup with 2 datasets if there files were qDESS data  '

    # Generator Nodes
    MASK_GENERATOR = 'MASK_GENERATOR detail'
    SHAPE_GENERATOR = 'SHAPE_GENERATOR detail'
    PHANTOM = "PHANTOM_GENERATOR"   
    TISSUE = 'TISSUE'

    # Simulation Nodes
    SSFP = 'SSFP'
    SSFP_SPECTRUM = 'SSFP_SPECTRUM'

    # SSFP Nodes
    SSFP_BAND_REMOVAL = 'SSFP_BAND_REMOVAL'
    SSFP_PLANET = 'SSFP_PLANET'
    SSFP_SFOV = 'SSFP_SFOV'
    
    # Filter Nodes
    MASK = '''Applies a mask to a dataset. Resultant image has all values where the corresponding value in the mask is zero set to zero. '''
    THRESHOLD_MASK = 'THRESHOLD_MASK detail'

    # Computer Nodes
    ADD = '''ADD detail'''
    MULT = '''MULT detail'''
    FIT = '''FIT detail'''
    SOS = '''any string
    $$
    SOS = a^2 + b^2
    $$
    '''
    CRSOS = '''Coil combination algorithm takes a collection of coil images and produces a weighted combination. The coil combination module in adopted the most commonly used root sum of squares (RSOS) method to preserve signal to noise ratio (SNR) without requiring detailed information about the magnetic field for each coil'''
    T2_qDESS = '''The QDESS T2 mapping module is able to compute pixel wise T2 values (an intrinsic tissue parameter) analytically using dicom images acquired at multiple echo times(TE). Applying a threshold on the set of T2 values allows quantitative mapping of a specific tissue.'''
    GRAPPA = '''The GRAPPA module realises a k-space domain reconstruction, whose inputs are undersampled k-space data where every few rows are skipped except for the centre, known as the auto-calibration signal. The spatial harmonics in a local k-space can be obtained from the ACS region and enables filling the unsampled region in k-space using linear interpolation. '''
    SENSE = '''SENSE allows is an common image domain based reconstruction algorithm. The input to both algorithms is undersampled k-space data where every few rows are skipped. SENSE uses the prior knowledge of the sensitivity profile as additional spatial encoding to ‘unfold’ the aliased image'''
    UNDERSAMPLE = '''For testing of the parallel imaging plugins as well as potential educational needs, an undersampling module was developed to reproduce aliasing artefacts resulting from direct inverse fourier transform of undersampled k-space data. As each parallel imaging method was designed for a particular undersampling pattern, the module incorporates undersampling trajectories for each technique and can be selected by the user upon running the app.'''
    RESIZE = 'RESIZE'
    SENSITIVITY_MAP = '''Sensitivity maps are used for sense, and can be obtained from dicom images'''
    DOSMA_TEST = "DOSMA_TEST"
    DOSMA_QDESS = "T2 quantitative map. Generates a T2 map for qDESS data using the DOSMA library. ( A deep-learning, open-source framework for musculoskeletal MRI analysis )"
    DOSMA_SEGMENTATION = "Segmentation mask generator. Generates the segmentation mask using the deep learning network used by DOSMA library.  ( A deep-learning, open-source framework for musculoskeletal MRI analysis )"
    CGSENSE = "An optimised reconstruction plugin of SENSE, cgSENSE, was also included, where cg stands for conjugate gradient. By using the forward model, computation speed can be reduced from O(N^3) to O(NlogN) compared to regular SENSE, with N being the number of iterations performed."
    FFT = "Applies Fourier transform on to input dataset"
    QDESS_ADC = "QDESS_ADC maps"
    MIRTorch_CS = "MIRTorch_CS"
    PARTIAL_FOURIER = "PARTIAL_FOURIER"
    SMS_RECON = "SMS_RECON"
    MTR = "MTR"

    # Output Nodes
    DISPLAY = '''Data display node. Displays data as 2d-image. Double click on image to use 3D Viewer. '''
    LINE_DISPLAY = 'LINE_DISPLAY'
    LAYER_DISPLAY = 'Data display node. Displays data as 2d-image with second image layered on top of first.'
    HISTOGRAM = 'Display a histogram of data values and displays data statistics. '
    EXPORT_FILE = 'EXPORT_FILE'

    # Debug Nodes
    DELAY = 'Adds a time delay'
    ERROR = 'Purposely throws an error'