import json
import jsonpickle
from graph.node import Node
from graph.link import Link
from graph.nodes import NodeInfo

class Graph:
    ''' Represents a computation graph '''

    def __init__(self):
        self.node_dict = {}
        self.links = []

    def __str__(self):
        node_dict =  '\n'.join([ f'{self.node_dict[node]}' for node in self.node_dict])
        links = '\n'.join([f'{str(link)}' for link in self.links])
        return f'Graph: \n nodes: \n{node_dict} \n links: \n{links}'

    def reset(self):
        self.node_dict = {}
        self.links = []

    def getNodeList(self, nodeids):
        nodes = []
        for nodeid in nodeids:
            node = self.getNode(nodeid)
            nodes.append(node)
        return nodes

    def getNode(self, nodeid):
        node = self.node_dict[nodeid]
        node.props = NodeInfo[node.props.type] # Replace with NodeInfo (enforces backend node structure)
        return node

    def addNode(self, node):
        ''' Adds node to graph '''

        self.node_dict[node.id] = node

    def getLink(self, linkid):
        return next(link for link in self.links if linkid == link.id)

    def getLinksFromEndNode(self, nodeid):
        return [link for link in self.links if link.hasEndNode(nodeid)]

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

    def export(self):
        ''' Formats graph data for exporting '''
        data = {
            'nodes': dict([(node, self.node_dict[node].dict()) for node in self.node_dict ]),
            'links': [link.dict() for link in self.links]
        }
        
        return data

    def json(self):
        ''' Converts graph into a json string '''
        data = self.export()
        json_string = jsonpickle.encode(data)
        return json_string

    def save(self, file = 'graph_model_data.json' ):
        ''' Saves graph to json file '''
        json_string = self.json()
        with open(file, 'w') as outfile:
            outfile.write(json_string)
        return json_string

    def load(self, jsondata):
        ''' Loads graph from json_string '''
        data = json.loads(jsondata)

        # Transform Node class from node dict 
        self.node_dict = dict([(node, Node.load(data['nodes'][node])) for node in data['nodes'] ])
        self.links = [Link.load(link) for link in data['links']]

        return None