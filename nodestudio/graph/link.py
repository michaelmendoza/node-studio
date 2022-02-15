import uuid
import json
import graph

class Link:
    ''' Represents a directional link between nodes '''

    def __init__(self, startNode: str, endNode: str, id: str = uuid.uuid1().hex):
        self.id = id
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

    def load(link_dict):
        ''' Create link from link_dict saved data'''
        link = Link(link_dict['startNode'], link_dict['endNode'], link_dict['id'])
        link.setup_link()
        return link

    def fromJson(json_string):
        ''' Create link from json string saved data'''

        link_dict = json.loads(json_string)
        link = Link.load(link_dict)
        return link
