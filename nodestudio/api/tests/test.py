from ..modules.graph.sesson import Session
from ..modules.graph.nodes import NodeType
from ..modules.graph.node import create_node
from ..modules.graph.graph import graph
from ..modules.process.file import file
import matplotlib.pyplot as plt

def test():
    a = create_node(NodeType.FILE, {'x':100, 'y':100})()
    b = create_node(NodeType.FILE, {'x':200, 'y':200})()
    c = create_node(NodeType.ADD, {'x':100, 'y':100})(a, b)
    d = create_node(NodeType.DISPLAY, {'x':100, 'y':100})(c)

    print(graph)

    graph.removeNode(d)

    print(graph)

    graph.removeLink(graph.links[0])

    print(graph)

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

    print(graph)

    output = Session.run(x)

    print(output.shape)

    plt.imshow(output[0,:,:], cmap=plt.cm.bone)
    plt.show()

    