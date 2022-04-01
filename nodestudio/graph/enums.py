from enum import Enum

class NodeType(Enum):
    # Variable Nodes
    VARIABLE = 'VARIABLE'

    # Input Nodes
    FILE = 'FILE'
    MOCK = 'MOCK'
    FILE_RAWDATA = 'FILE_RAWDATA'

    # Computer Nodes
    ADD = 'ADD'
    MULT = 'MULT'
    MASK = 'MASK'
    FIT = 'FIT'
    SOS = 'SOS'
    CRSOS = 'CRSOS'
    T2_qDESS = 'T2_qDESS'
    GRAPPA = 'GRAPPA'
    UNDERSAMPLE = 'UNDERSAMPLE'
    
    # Output Nodes
    DISPLAY = 'DISPLAY'
    CDISPLAY = 'CDISPLAY'

class NodeDetail(Enum):
    BLANK = ''

    # Variable Nodes
    VARIABLE = ''' Variable Detail '''

    # Input Nodes
    FILE = ''' # File 
    Supports:
    - Dicoms
    '''
    MOCK = '''MOCK detail'''
    FILE_RAWDATA = '''FILE_RAWDATA detail'''

    # Computer Nodes
    ADD = '''ADD detail'''
    MULT = '''MULT detail'''
    MASK = '''MASK detail'''
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
    UNDERSAMPLE = '''UNDERSAMPLE detail'''
    
    # Output Nodes
    DISPLAY = '''DISPLAY detail'''
    CDISPLAY = '''CDISPLAY detail'''