
from graph import current_graph
from nodestudio.graph.link import Link
from nodestudio.graph.node import Node
from nodestudio.graph.sesson import Session

def get_graph():
    json_string = current_graph.json()
    return json_string

def create_graph(data):
    current_graph.load(data.json_string)
    json_string = current_graph.json()
    return json_string

def add_node(data):
    node = Node.fromJson(data.json_string)
    current_graph.addNode(node)
    return node.dict()

def update_node():
    pass

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