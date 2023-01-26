__all__ = ["enums, graph, link, node, nodes, sesson"]

from .graph import Graph
current_graph = Graph()

def get_graph():
    return current_graph