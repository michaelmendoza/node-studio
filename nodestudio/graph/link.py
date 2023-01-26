import uuid
import json
import graph

class Link:
    ''' Represents a directional link between nodes '''

    def __init__(self, startNode: str, startPort: int, endNode: str, endPort: int, id: str = None):
        self.id = uuid.uuid1().hex if id == None else id
        self.startNode = startNode
        self.startPort = startPort
        self.endNode = endNode
        self.endPort = endPort

    def __str__(self):
        return f'[{self.startNode}, {self.endNode}]'

    def hasEndNode(self, endNodeId):
        return endNodeId == self.endNode

    def dict(self):
        return { 'id': self.id, 
            'startNode': self.startNode, 'startPort': self.startPort, 
            'endNode': self.endNode, 'endPort': self.endPort }

    def setup_link(self):      
        ''' Creates input/output references for link nodes.''' 
        endNode = graph.current_graph.getNode(self.endNode)
        startNode = graph.current_graph.getNode(self.startNode)
        
        endNode.inputs.append(self.startNode)
        startNode.outputs.append(self.endNode)
        pass

    def load(link_dict):
        ''' Create link from link_dict saved data'''
        link = Link(link_dict['startNode'], link_dict['startPort'], link_dict['endNode'], link_dict['endPort'], link_dict['id'])
        link.setup_link()
        return link

    def fromJson(json_string):
        ''' Create link from json string saved data'''

        link_dict = json.loads(json_string)
        link = Link.load(link_dict)
        return link
