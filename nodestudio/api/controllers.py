import json
import base64
import jsonpickle
import numpy as np
from graph import current_graph
from graph.link import Link
from graph.node import Node
from graph.nodes import NodeInfo
from graph.sesson import Session

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

def get_node_data(node_id, slice, index):
    node = current_graph.getNode(node_id)

    if slice == 'xy':
        value = node.value[index,:,:]
    elif slice == 'xz':
        value = node.value[:,index,:]
        value = np.ascontiguousarray(value)
    elif slice == 'yz':
        value = node.value[:,:,index]
        value = np.ascontiguousarray(value)
    else:
        value = node.value
    
    encodedData = base64.b64encode(value)
    return { 'encoded': encodedData, 'shape': value.shape, 'dtype': str(value.dtype), 'size': value.size }

def add_node(data):
    node = Node.fromJson(data.json_string)
    current_graph.addNode(node)
    return node.dict()

def update_node(data):
    node_dict = json.loads(data.json_string)
    node : Node = current_graph.getNode(node_dict['id'])
    node.update(node_dict)
    return node.dict()

def delete_node(node_id):  
    node : Node = current_graph.getNode(node_id)
    current_graph.removeNode(node)
    return node.dict()

def add_link(data):
    link = Link.fromJson(data.json_string)
    current_graph.addLink(link)
    return link.dict()

def delete_link(link_id):
    link = current_graph.getLink(link_id)
    current_graph.removeLink(link)

def run_session(node_id):
    node : Node = current_graph.getNode(node_id)
    Session.run(node)
    return node.value