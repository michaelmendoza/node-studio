from enum import Enum

class NodeType(Enum):
    # Variable Nodes
    VARIABLE = 'VARIABLE'

    # Input Nodes
    FILE = 'FILE'
    FILE_RAWDATA = 'FILE_RAWDATA'
    MOCK = 'MOCK'

    # Generator Nodes
    MASK_GENERATOR = 'MASK_GENERATOR'
    SHAPE_GENERATOR = 'SHAPE_GENERATOR'

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
    
    # Output Nodes
    DISPLAY = 'DISPLAY'
    CDISPLAY = 'CDISPLAY'
    LAYER_DISPLAY = 'LAYER_DISPLAY'
    HISTOGRAM = 'HISTOGRAM'

class NodeDetail(Enum):
    BLANK = ''

    # Variable Nodes
    VARIABLE = ''' Variable Detail '''

    # Input Nodes
    FILE = ''' # File 
    Supports:
    - Dicoms
    '''
    FILE_RAWDATA = '''FILE_RAWDATA detail'''
    MOCK = '''MOCK detail'''

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
    CRSOS = '''CRSOS detail'''
    T2_qDESS = '''T2_qDESS detail'''
    GRAPPA = '''GRAPPA detail'''
    SENSE = '''SENSE detail'''
    UNDERSAMPLE = '''UNDERSAMPLE detail'''
    SENSITIVITY_MAP = '''SENSITIVITY_MAP detail'''
    DOSMA_QDESS = "DOSMA_QDESS detail"
    # Output Nodes
    DISPLAY = '''DISPLAY detail'''
    CDISPLAY = '''CDISPLAY detail'''
    LAYER_DISPLAY = 'LAYER_DISPLAY detail'
    HISTOGRAM = 'HISTOGRAM detail'