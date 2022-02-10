
import uuid
from typing import List

from .link import Link
from .graph import graph
from .nodes import NodeInfo, NodeProps

def create_node(type, props):  
    ''' Node creation factory '''

    nodeInfo = NodeInfo[type].dict()
    def _lambda(*inputs): 
        _props = NodeProps(** { **nodeInfo, **props })
        return Node(_props, inputs)
    return _lambda

class Node:
    ''' Represents a Node for computation '''

    def __init__(self, props: NodeProps, inputs: List):
        self.id = uuid.uuid1()
        self.props = props # Node properties
        self.inputs = [input.id for input in inputs] if inputs else []  # List input node ids
        self.outputs = []                                               # List of consumers i.e. nodes that recieve this node as an input
        self.value = None
        self.fn = None

        # Add links to all input nodes
        if inputs is not None:
            for input in inputs:
                input.outputs.append(self.id)
                Link(input, self)

        # Add node to graph
        graph.addNode(self)
    def __str__(self):
        return f"Node: {self.id} {self.props}"

    def compute(self):
        print(f'Compute: {self.props}')

        if self.props.fn:
            args = self.props.args
            inputs = []
            for nodeid in self.inputs:
                node = graph.getNode(nodeid)
                inputs.append(node.value)

            #inputs = [ graph.getNode(nodeid).value for nodeid in self.inputs ]
            self.value = self.props.fn(*inputs, **args)
        print(f'Computed complete.')


