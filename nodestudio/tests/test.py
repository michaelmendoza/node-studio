import time
import numpy as np
import base64
from graph import current_graph
from graph.sesson import Session
from graph.nodes import NodeType
from graph.node import create_node
from process.file import file
import matplotlib.pyplot as plt
import mapvbvd

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

    plt.imshow(output[60,:,:], cmap=plt.cm.bone)
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
    
def test5():
    filename = '/Users/michael/projects/MRI/data/gasp/20190827_GASP_INVIVO_BRAIN_HIP/meas_MID299_TRUFI_TE3_FID49324.dat'
    twixObj = mapvbvd.mapVBVD(filename) 
    fullSize = twixObj.image.fullSize
    sqzDims = twixObj.image.sqzDims
    print(sqzDims)

    twixObj.image.squeeze = True
    data = twixObj.image['']

    linIndex = sqzDims.index('Lin')
    data = np.moveaxis(data, linIndex, 0)
    sqzDims.insert(0, sqzDims.pop(linIndex))
    print(data.shape, sqzDims)

    chaIndex = sqzDims.index('Cha')
    reduced_data = np.mean(data, axis=chaIndex)
    sqzDims.pop(chaIndex)

    aveIndex = sqzDims.index('Ave')
    reduced_data = np.mean(reduced_data, axis=aveIndex)
    sqzDims.pop(aveIndex)

    repIndex = sqzDims.index('Rep')
    reduced_data = np.mean(reduced_data, axis=repIndex)
    sqzDims.pop(repIndex)
    print(reduced_data.shape, sqzDims)

    plt.imshow(np.abs(reduced_data))
    plt.show()

    image_data = np.fft.fftshift(np.fft.ifft2(np.fft.fftshift(reduced_data, axes=(0, 1)), axes=(0, 1)), axes=(0, 1))
    plt.imshow(np.abs(image_data))
    plt.show()

def test6():
    filename = '/Users/michael/projects/MRI/data/10182017_WholeBodyFat/meas_MID469_Ax___Abdomen_gre_te523_FID3465.dat'
    twixObj = mapvbvd.mapVBVD(filename) 
    fullSize = twixObj.image.fullSize
    sqzDims = twixObj.image.sqzDims
    print(sqzDims)

    twixObj.image.squeeze = True
    data = twixObj.image['']
    
    linIndex = sqzDims.index('Lin')
    data = np.moveaxis(data, linIndex, 0)
    sqzDims.insert(0, sqzDims.pop(linIndex))
    print(data.shape, sqzDims)

    aveIndex = sqzDims.index('Ave')
    data = np.mean(data, axis=aveIndex)
    sqzDims.pop(aveIndex)

    data = np.fft.fftshift(np.fft.ifft2(np.fft.fftshift(data, axes=(0, 1)), axes=(0, 1)), axes=(0, 1))

    sliceIndex = sqzDims.index('Sli')
    data = np.moveaxis(data, sliceIndex, 0)
    sqzDims.insert(0, sqzDims.pop(sliceIndex))
    print(data.shape, sqzDims)

    plt.imshow(np.abs(data[0]))
    plt.show()