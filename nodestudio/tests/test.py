from graph import current_graph
from graph.sesson import Session
from graph.nodes import NodeType
from graph.node import create_node
from process.file import file
import matplotlib.pyplot as plt

def test():
    a = create_node(NodeType.FILE, {'x':100, 'y':100})()
    b = create_node(NodeType.FILE, {'x':200, 'y':200})()
    c = create_node(NodeType.ADD, {'x':100, 'y':100})(a, b)
    d = create_node(NodeType.DISPLAY, {'x':100, 'y':100})(c)

    print(current_graph)

    current_graph.removeNode(d)

    print(current_graph)

    current_graph.removeLink(current_graph.links[0])

    print(current_graph)

def test2():
    path = '/Users/michael/projects/MRI/data/foot_data/'
    data = file.read_dicom(path)
    
    #plt.imshow(data[0].pixel_array, cmap=plt.cm.bone)
    plt.imshow(data[0,:,:], cmap=plt.cm.bone)
    plt.show()

def test3():
    filepath = '/Users/michael/projects/MRI/data/foot_data/'
    x = create_node(NodeType.FILE, {'x':100, 'y':100, 'args':{'filetype':'dicom', 'filepath':filepath}})()
    x = create_node(NodeType.MASK, {'x':200, 'y':100, 'args':{'masktype':'circular'}})(x)
    x = create_node(NodeType.DISPLAY, {'x':300, 'y':100})(x)
    current_graph.save()

    print(current_graph)

    output = Session.run(x)

    print(output.shape)

    plt.imshow(output[0,:,:], cmap=plt.cm.bone)
    plt.show()

def test4():
    json_string = '{"nodes": [{"id": "4ce1b6d68a1211ec8516acde48001122", "props": {"type": "FILE", "x": 100, "y": 100, "input": [], "output": ["out"], "options": ["filetype", "filepath"], "args": {"filetype": "dicom", "filepath": "/Users/michael/projects/MRI/data/foot_data/"}}, "inputs": [], "output": ["4ce1c07c8a1211ec8516acde48001122"]}, {"id": "4ce1c07c8a1211ec8516acde48001122", "props": {"type": "MASK", "x": 200, "y": 100, "input": ["a"], "output": ["out"], "options": ["masktype"], "args": {"masktype": "circular"}}, "inputs": ["4ce1b6d68a1211ec8516acde48001122"], "output": ["4ce1c7c08a1211ec8516acde48001122"]}, {"id": "4ce1c7c08a1211ec8516acde48001122", "props": {"type": "DISPLAY", "x": 300, "y": 100, "input": ["a"], "output": [], "options": [], "args": {}}, "inputs": ["4ce1c07c8a1211ec8516acde48001122"], "output": []}], "links": [{"id": "4ce1c3068a1211ec8516acde48001122", "startNode": "4ce1b6d68a1211ec8516acde48001122", "endNode": "4ce1c07c8a1211ec8516acde48001122"}, {"id": "4ce1c89c8a1211ec8516acde48001122", "startNode": "4ce1c07c8a1211ec8516acde48001122", "endNode": "4ce1c7c08a1211ec8516acde48001122"}]}'
    current_graph.load(json_string)

    print(current_graph)
    x = [node for node in current_graph.node_dict.values() if node.props.type.name == 'DISPLAY'][0]

    output = Session.run(x)

    print(output.shape)

    plt.imshow(output[0,:,:], cmap=plt.cm.bone)
    plt.show()