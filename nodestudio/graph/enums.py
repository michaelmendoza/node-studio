from enum import Enum

class NodeType(Enum):
    # Variable Nodes
    VARIABLE = 'VARIABLE'

    # Input Nodes
    FILE = 'FILE'
    FILE_RAWDATA = 'FILE_RAWDATA'

    # Computer Nodes
    ADD = 'ADD'
    MULT = 'MULT'
    MASK = 'MASK'
    FIT = 'FIT'
    
    # Output Nodes
    DISPLAY = 'DISPLAY'