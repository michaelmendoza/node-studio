from enum import Enum

class NodeType(Enum):
    # Variable Nodes
    VARIABLE = 'Variable'

    # Input Nodes
    FILE = 'File'

    # Computer Nodes
    ADD = 'Add'
    MULT = 'Multiply'
    MASK = 'Mask'
    FIT = 'Fit'
    
    # Output Nodes
    DISPLAY = 'Display'