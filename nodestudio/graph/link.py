import uuid
import graph

class Link:
    ''' Represents a directional link between nodes '''

    def __init__(self, startNode: str, endNode: str, id: str = uuid.uuid1().hex):
        self.startNode = startNode
        self.endNode = endNode

    def __str__(self):
        return f'[{self.startNode}, {self.endNode}]'

    def dict(self):
        return { 'id': self.id, 'startNode': self.startNode, 'endNode': self.endNode }

    def setup_link(self):       
        endNode = graph.current_graph.getNode(self.endNode)
        startNode = graph.current_graph.getNode(self.startNode)
        
        endNode.inputs.append(self.startNode)
        startNode.outputs.append(self.endNode)
        pass