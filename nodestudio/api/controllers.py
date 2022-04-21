import base64
import numpy as np
from graph import current_graph
from graph.link import Link
from graph.node import Node
from graph.nodes import NodeInfo, NodeProps
from graph.sesson import Session
from graph.interfaces import LinkData

def get_nodelist():
    data = NodeInfo
    return data
    
def get_graph():
    json_string = current_graph.json()
    return json_string

def create_graph(data):
    current_graph.load(data.json_string)
    json_string = current_graph.json()
    return json_string

def reset_graph():
    current_graph.reset()
    return current_graph.json()

def get_node_data(node_id, slice, index):
    node = current_graph.getNode(node_id)

    if 'data' not in node.value:
        return ''

    if slice == 'xy':
        value = node.value['data'][index,:,:]
        value = np.ascontiguousarray(value)
    elif slice == 'xz':
        value = node.value['data'][:,index,:]
        value = np.ascontiguousarray(value)
    elif slice == 'yz':
        value = node.value['data'][:,:,index]
        value = np.ascontiguousarray(value)
    else:
        value = node.value['data']
    
    encodedData = base64.b64encode(value)

    output = { 'encoded': encodedData, 'shape': value.shape, 'dtype': str(value.dtype), 'size': value.size,
        'slice': slice, 'fullshape': node.value['data'].shape, 'resolution': node.value['resolution'], 'isScaled': node.value['isScaled'],
        'min': node.value['min'], 'max': node.value['max'], 'mean': node.value['mean'], 'std': node.value['std'], 'histogram': node.value['histogram']
    }

    return output

def get_node_metadata(node_id):
    node = current_graph.getNode(node_id)

    if 'data' not in node.value:
        return {}
    
    output = {  
        'fullshape': node.value['data'].shape, 'resolution': node.value['resolution'], 'isScaled': node.value['isScaled'],
        'min': node.value['min'], 'max': node.value['max'], 'mean': node.value['mean'], 'std': node.value['std'], 'histogram': node.value['histogram']
    }   
    return output

def add_node(data):
    node = Node.load(data.dict())
    return node.dict()

def update_node(data):
    node : Node = current_graph.getNode(data.id)
    node.update(data)
    return node.dict()

def delete_node(node_id):  
    node : Node = current_graph.getNode(node_id)
    current_graph.removeNode(node)
    return node.dict()

def add_link(data: LinkData):
    link = Link(data.startNode, data.startPort, data.endNode, data.endPort, id=data.id)
    link.setup_link()
    current_graph.addLink(link)
    return link.dict()

def delete_link(link_id):
    link = current_graph.getLink(link_id)
    current_graph.removeLink(link)

def run_session(node_ids):
    session_metadata = Session.run(node_ids)
    return session_metadata