
class Graph:
    ''' Represents a computation graph '''

    def __init__(self):
        self.node_dict = {}
        self.nodes = []
        self.links = []

    def __str__(self):
        node_dict =  '\n'.join([ f'{self.node_dict[node]}' for node in self.node_dict])
        links = '\n'.join([f'{str(link)}' for link in self.links])
        return f'Graph: \n nodes: \n{node_dict} \n links: \n{links}'

    def getNode(self, nodeid):
        return self.node_dict[nodeid]

    def addNode(self, node):
        ''' Adds node to graph '''

        self.node_dict[node.id] = node
        self.nodes.append(node.id)

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
        self.nodes.remove(node.id)

    def removeLink(self, link):
        ''' Removes link from graph '''

        # Remove end node from start node outputs
        startNode = self.node_dict[link.startNode]
        startNode.outputs.remove(link.endNode)

        # Remove start node from end node inputs
        endNode = self.node_dict[link.endNode]
        endNode.inputs.remove(link.startNode)
  
        self.links.remove(link)

    def save():
        pass

    def load():
        pass


graph = Graph()