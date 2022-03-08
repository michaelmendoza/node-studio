from enum import Enum

class NodeType(Enum):
    # Variable Nodes
    VARIABLE = 'VARIABLE'

    # Input Nodes
    FILE = 'FILE'

    # Computer Nodes
    ADD = 'ADD'
    MULT = 'MULT'
    MASK = 'MASK'
    FIT = 'FIT'
    RSOS = 'RSOS'
    
    # Output Nodes
    DISPLAY = 'DISPLAY'