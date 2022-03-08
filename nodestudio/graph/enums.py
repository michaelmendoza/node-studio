from enum import Enum

class NodeType(Enum):
    # Variable Nodes
    VARIABLE = 'VARIABLE'

    # Input Nodes
    FILE = 'FILE'
    MOCK = 'MOCK'

    # Computer Nodes
    ADD = 'ADD'
    MULT = 'MULT'
    MASK = 'MASK'
    FIT = 'FIT'
    RSOS = 'RSOS'
    T2_qDESS = 'T2_qDESS'
    
    # Output Nodes
    DISPLAY = 'DISPLAY'