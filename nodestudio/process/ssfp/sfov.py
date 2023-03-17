from graph.interfaces import NodeProps, NodeType

def SSFP_SFOV():
    return NodeProps(type=NodeType.SSFP_SFOV,
                     name="ssfp sFOV",
                     tags=['ssfp'],
                     description='ssfp super FOV',
                     detail='',
                     input=['dataset'],
                     output=['out'],
                     options=[],
                     fn=sfov)

def sfov(dataset):
    pass