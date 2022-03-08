import uuid
import json
from typing import List

from pydantic import BaseModel
import graph
from graph.link import Link
from graph.enums import NodeType
from graph.nodes import NodeInfo, NodeProps
from graph.interfaces import NodeData

class NodeStyles(BaseModel):
    x: int = 0
    y: int = 0
class Node:
    ''' Represents a Node for computation '''

    def __init__(self, props: NodeProps, inputs: List = [], outputs: List = [], styles: NodeStyles = NodeStyles(), args = {}, id: str = None):
        self.id = uuid.uuid1().hex if id == None else id
        self.props = props          # Node immutable properties (Designated in NodeInfo)
        self.inputs = inputs        # List input node ids
        self.outputs = outputs      # List of consumers i.e. nodes that recieve this node as an input
        self.styles = styles        # Node UI styles
        self.args = args            # Function args
        self.value = None           # Cached compute result

        # Add links to all input nodes
        inputs = graph.current_graph.getNodeList(inputs)
        for index, input in enumerate(inputs):
            input.outputs.append(self.id)
            link = Link(input.id, 0, self.id, index)
            graph.current_graph.addLink(link)
        
        # Add node to graph
        graph.current_graph.addNode(self)

    def __str__(self):
        return f"Node: {self.id} {self.props} {self.inputs} {self.outputs} {self.styles} {self.args}"

    def dict(self):
        ''' Returns dictionary representation of node. Used in saving node to json. '''
        props = self.props.dict()
        styles = self.styles.dict()
        props['type'] = props['type'].name
        del props['fn']
        return { 'id': self.id, 'props': props, 'inputs': self.inputs, 'outputs': self.outputs, 'styles': styles, 'args': self.args }

    def compute(self):
        print(f'Compute: {self.props}')

        if self.props.fn:
            args = self.args
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

    def update(self, node_data):
        ''' Updates node properties. Currently only updates x, y, and args. '''            
        if node_data.styles:
            self.styles = NodeStyles(**node_data.styles)
        if node_data.args:
            self.args = node_data.args

    def create(type, props):  
        ''' Node creation factory. Class function. '''

        nodeInfo = NodeInfo[type].dict()                              # Retrive nodeinfo from type
        styles = NodeStyles({ 'x':props['x'], 'y':props['y']})

        def _lambda(*inputs): 
            _props = NodeProps(** { **nodeInfo, **props })            # Combine nodeinfo and props
            inputs = [input.id for input in inputs] if inputs else [] # Convert from list[Node] to list[nodeid]
            return Node(_props, inputs = inputs, outputs = [], styles = styles)
        return _lambda

    def load(node_data):
        ''' Create node from node_dict saved data. Class function. '''
        node_data = NodeData(**node_data)
        type =  NodeType[node_data.props['type']]
        props = NodeInfo[type]
        styles = NodeStyles(**node_data.styles)
        args = node_data.args
        return Node(props, inputs=[], outputs=[], styles=styles, args=args, id=node_data.id)

    def fromJson(json_string):
        ''' Create node from json string saved data. Class function. '''

        node = json.loads(json_string)
        return Node.load(node)

def create_node(type, props):  
    ''' Node creation factory '''
    return Node.create(type, props)