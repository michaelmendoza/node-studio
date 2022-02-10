import uuid
from .graph import graph 

class Link:
    ''' Represents a directional link between nodes '''

    def __init__(self, startNode, endNode):
        self.id = uuid.uuid1()
        self.startNode = startNode.id
        self.endNode = endNode.id
        graph.addLink(self)

    def __str__(self):
        return f'[{self.startNode}, {self.endNode}]'