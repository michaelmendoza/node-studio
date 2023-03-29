from mssfp.phantoms import generate_brain_phantom
from core.datagroup import DataGroup
from graph.interfaces import NodeProps, NodeType

def TISSUE():
    return NodeProps(type=NodeType.TISSUE, 
                     name="tissue", 
                     tags=['generator'], 
                     description='tissue phantom generator', 
                     detail='', 
                     output=['out'], 
                     options=[  'size',
                                'frequency',
                                { 'name':'rotate', 'flag': True }, 
                                { 'name':'deform', 'flag': True }], 
                     fn=tissue_brain_generator)

def tissue_brain_generator(size, frequency, rotate, deform):
    size = int(size)
    frequency = float(frequency)
    phantom = generate_brain_phantom(data_indices=[1, 150], rotate = rotate, deform = deform)
    dg = DataGroup(phantom)
    return dg