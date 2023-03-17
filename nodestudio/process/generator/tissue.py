from mssfp.phantoms import generate_brain_phantom
from core.datagroup import DataGroup
from graph.interfaces import NodeProps, NodeType

def TISSUE():
    return NodeProps(type=NodeType.TISSUE, name="tissue", tags=['generator'], description='tissue phantom generator', detail='', output=['out'], fn=tissue_brain_generator)

def tissue_brain_generator():
    phantom = generate_brain_phantom(data_indices=[1, 150])
    dg = DataGroup(phantom)
    return dg