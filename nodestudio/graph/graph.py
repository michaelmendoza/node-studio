import json
import jsonpickle

from graph.nodes import NodeProps, NodeInfo
from graph.enums import NodeType
from graph.node import Node
from graph.link import Link

class Graph:
    ''' Represents a computation graph '''

    def __init__(self):
        self.node_dict = {}
        self.links = []

    def __str__(self):
        node_dict =  '\n'.join([ f'{self.node_dict[node]}' for node in self.node_dict])
        links = '\n'.join([f'{str(link)}' for link in self.links])
        return f'Graph: \n nodes: \n{node_dict} \n links: \n{links}'

    def getNodeList(self, nodeids):
        nodes = []
        for nodeid in nodeids:
            node = self.getNode(nodeid)
            nodes.append(node)
        return nodes

    def getNode(self, nodeid):
        return self.node_dict[nodeid]

    def addNode(self, node):
        ''' Adds node to graph '''

        self.node_dict[node.id] = node

    def addLink(self, link):
        ''' Adds link to graph '''

        self.links.append(link)

    def removeNode(self, node):
        ''' Removes node from graph '''

        # Remove this node from inputs
        for node_id in node.outputs:
            _node = self.node_dict[node_id]
            _node.inputs.remove(node.id)

        # Remove this node from outputs
        for node_id in node.inputs:
            _node = self.node_dict[node_id]
            _node.outputs.remove(node.id)

        # Remove links with this node
        links = [x for x in self.links if (x.startNode == node.id or x.endNode == node.id)]
        for link in links:
            self.links.remove(link)

        del self.node_dict[node.id]

    def removeLink(self, link):
        ''' Removes link from graph '''

        # Remove end node from start node outputs
        startNode = self.node_dict[link.startNode]
        startNode.outputs.remove(link.endNode)

        # Remove start node from end node inputs
        endNode = self.node_dict[link.endNode]
        endNode.inputs.remove(link.startNode)
  
        self.links.remove(link)

    def save(self):
        data = {
            'nodes': [node.dict() for node in self.node_dict.values()],
            'links': [link.dict() for link in self.links]
        }
        
        json_string = jsonpickle.encode(data)

        with open('json_data.json', 'w') as outfile:
            outfile.write(json_string)

        return json_string

    def load(self, jsondata):
        data = json.loads(jsondata)

        # Transform Node class from node dict 
        nodes = []
        for node in data['nodes']:
            type =  NodeType[node['props']['type']]
            node['props']['type'] = type
            node['props']['fn'] =  NodeInfo[type].dict()['fn']
            props = NodeProps(**node['props'])

            nodes.append(Node(props, [], node['id']))
        self.node_dict = dict([(node.id, node) for node in nodes ])

        self.links = [Link(link['startNode'], link['endNode'], link['id']) for link in data['links']]
        for link in self.links:
            link.setup_link()

        return None
