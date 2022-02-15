import uuid
import json
from typing import List
import graph
from graph.link import Link
from graph.enums import NodeType
from graph.nodes import NodeInfo, NodeProps

def create_node(type, props):  
    ''' Node creation factory '''
    return Node.create(type, props)

class Node:
    ''' Represents a Node for computation '''

    def __init__(self, props: NodeProps, inputs: List, id: str = None):
        self.id = uuid.uuid1().hex if id == None else id
        self.props = props    # Node properties
        self.inputs = inputs  # List input node ids
        self.outputs = []     # List of consumers i.e. nodes that recieve this node as an input
        self.value = None
        self.fn = None

        # Add links to all input nodes
        inputs = graph.current_graph.getNodeList(inputs)
        for input in inputs:
            input.outputs.append(self.id)
            link = Link(input.id, self.id)
            graph.current_graph.addLink(link)
        
        # Add node to graph
        graph.current_graph.addNode(self)

    def __str__(self):
        return f"Node: {self.id} {self.props} {self.inputs} {self.outputs}"

    def dict(self):
        ''' Returns dictionary representation of node. Used in saving node to json. '''
        props = self.props.dict()
        props['type'] = props['type'].name
        del props['fn']
        return { 'id': self.id, 'props': props, 'inputs': self.inputs, 'output': self.outputs }

    def compute(self):
        print(f'Compute: {self.props}')

        if self.props.fn:
            args = self.props.args
            inputs = graph.current_graph.getNodeList(self.inputs)
            values = [input.value for input in inputs]
            self.value = self.props.fn(*values, **args)

        print(f'Computed complete.')

    def add_link(self, link: Link):
        ''' Add link to nodde -- Assumes Link already created '''
        
        if link.endNode != self.id:
            return

        self.inputs.append(link.startNode)
        input = graph.getNode(link.startNode)
        input.outputs.append(self.id)

    def update(self, node_dict):
        ''' Updates node properties. Currently only updates x, y, and args. '''
        if node_dict['props']:
            props =  node_dict['props']
            if props['x']:
                self.props.x = props['x']
            if props['y']:
                self.props.x = props['y']
            if props['args']:
                self.props.args = props['args']

    def create(type, props):  
        ''' Node creation factory. Class function. '''

        nodeInfo = NodeInfo[type].dict()                              # Retrive nodeinfo from type
        def _lambda(*inputs): 
            _props = NodeProps(** { **nodeInfo, **props })            # Combine nodeinfo and props
            inputs = [input.id for input in inputs] if inputs else [] # Convert from list[Node] to list[nodeid]
            return Node(_props, inputs)
        return _lambda

    def load(node_dict):
        ''' Create node from node_dict saved data. Class function. '''
        type =  NodeType[node_dict['props']['type']]
        node_dict['props']['type'] = type
        node_dict['props']['fn'] =  NodeInfo[type].dict()['fn']
        props = NodeProps(**node_dict['props'])
        return Node(props, [], node_dict['id'])

    def fromJson(json_string):
        ''' Create node from json string saved data. Class function. '''

        node = json.loads(json_string)
        return Node.load(node)