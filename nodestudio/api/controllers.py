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

    if isinstance(node.value, list):
        output = []
        for datum in node.value:
            output.append(process_and_encode_dataslice(datum, slice, index))
    else:
        output = process_and_encode_dataslice(node.value, slice, index)
    return output

def process_and_encode_dataslice(data, slice, index):
    if 'data' not in data:
        return {}

    if slice == 'xy':
        value = data['data'][index,:,:]
    elif slice == 'xz':
        value = data['data'][:,index,:]
    elif slice == 'yz':
        value = data['data'][:,:,index]
    else:
        value = data['data']
    
    value = np.ascontiguousarray(value)
    encodedData = base64.b64encode(value)
    
    output = data.copy()
    del output["data"]
    output['encoded'] = encodedData
    output['shape'] = value.shape
    output['slice'] = slice
    return output

def get_node_metadata(node_id):
    node = current_graph.getNode(node_id)
    
    if isinstance(node.value, list):
        output = []
        for datum in node.value:
            output.append(process_metadata(datum))
    else:
        output = process_metadata(node.value)
    return output

def process_metadata(data):
    if 'data' not in data:
        return {}
    
    output = data.copy()
    del output["data"]
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