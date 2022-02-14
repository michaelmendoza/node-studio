import uuid
import json
from typing import List
import graph
from graph.link import Link
from graph.enums import NodeType
from graph.nodes import NodeInfo, NodeProps

def create_node(type, props):  
    ''' Node creation factory '''
    Node.create(type, props)

class Node:
    ''' Represents a Node for computation '''

    def __init__(self, props: NodeProps, inputs: List, id: str = uuid.uuid1().hex):
        self.id = id
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
        return f"Node: {self.id} {self.props}"

    def dict(self):
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

    def create(type, props):  
        ''' Node creation factory '''

        nodeInfo = NodeInfo[type].dict()                              # Retrive nodeinfo from type
        def _lambda(*inputs): 
            _props = NodeProps(** { **nodeInfo, **props })            # Combine nodeinfo and props
            inputs = [input.id for input in inputs] if inputs else [] # Convert from list[Node] to list[nodeid]
            return Node(_props, inputs)
        return _lambda

    def load(node_dict):
        ''' Create node from node_dict saved data '''
        type =  NodeType[node_dict['props']['type']]
        node_dict['props']['type'] = type
        node_dict['props']['fn'] =  NodeInfo[type].dict()['fn']
        props = NodeProps(**node_dict['props'])
        return Node(props, [], node_dict['id'])

    def fromJson(json_string):
        ''' Create node from json string saved data '''

        node = json.loads(json_string)
        return Node.load(node)