import time
import numpy as np
import base64
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
    
    plt.show()
    for i in range(data.shape[0]):
        print(i)
        plt.imshow(data[i,:,:], cmap=plt.cm.bone)
        plt.draw()
        plt.pause(0.05)

def test2a():
    path = '/Users/michael/projects/MRI/data/foot_data/'
    data = file.read_dicom(path)
    
    slice = 'yz'
    if slice == 'xy':
        length = data.shape[0]
    elif slice == 'xz':
        length = data.shape[1]
    elif slice == 'yz':
        length = data.shape[2]

    plt.show()
    for i in range(length):
        if slice == 'xy':
            value = data[i,:,:]
        elif slice == 'xz':
            value = data[:,i,:]
            value = np.ascontiguousarray(value)
        elif slice == 'yz':
            value = data[:,:,i]
            value = np.ascontiguousarray(value)
        
        #encodedData = base64.b64encode(value)

        print(i)
        plt.imshow(value, cmap=plt.cm.bone)
        plt.draw()
        plt.pause(0.05)

def test2b():
    x = np.linspace(0, 255, 256, dtype='uint16')
    x = np.reshape(x, ( 16, 16))
    plt.imshow(x)
    plt.show()
    print(x.dtype)
    encodedData = base64.b64encode(x)
    print(encodedData)
    print(x.shape)
    print(x.size)

def test2c():
    x = np.linspace(0, 255, 256, dtype='uint16')
    x = np.reshape(x, ( 8, 32))
    plt.imshow(x)
    plt.show()
    print(x.dtype)
    encodedData = base64.b64encode(x)
    print(encodedData)
    print(x.shape)
    print(x.size)

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
    