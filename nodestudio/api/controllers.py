import math
import base64
import json
import uuid
import traceback
import numpy as np
from io import BytesIO
from PIL import Image
from api import websocket
from graph import current_graph
from graph.link import Link
from graph.node import Node
from graph.nodes import NodeInfo
from graph.sesson import Session
from graph.interfaces import LinkData
from core import NodeDataset, DataGroup, io, path

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

def get_graph_nodeview_metadata():
    metadata = {}
    for node_id in current_graph.node_dict:
        metadata[node_id] = get_node_view_metadata(node_id)
    return metadata

def encode_data(data, key):

    if isinstance(data, np.ndarray) or isinstance(data, NodeDataset):
        data = eval(f'data{key}')
        data = np.ascontiguousarray(data)

        isComplex= False
        if np.iscomplexobj(data):
            data = np.abs(data)
            isComplex = True

        min = float(np.nanmin(data))
        max = float(np.nanmax(data))
        scaled_data = (data - min) * 255 / (max - min)
        scaled_data = np.uint8(scaled_data)

        scaled_data = np.ascontiguousarray(scaled_data)
        encodedData = base64.b64encode(scaled_data)
        return  { 'encoded': encodedData, 'dtype':'uint8', 'isComplex':isComplex, 'shape': data.shape, 'fullshape': data.shape, 'isScaled': True, 'resolution': 255, 'min':min, 'max':max }

def get_node_value(node_id, key):
    node = current_graph.getNode(node_id)
    value = node.value
    if isinstance(value, DataGroup):
        value = value.values()[0]
    encoded = encode_data(value, key)
    return encoded

def get_node_value_uncompressed(node_id, key):
    node = current_graph.getNode(node_id)

    if isinstance(node.value, np.ndarray) or isinstance(node.value, NodeDataset):
        data = eval(f'node.value{key}')
        data = np.ascontiguousarray(data)

        isComplex= False
        if np.iscomplexobj(data):
            data = np.abs(data)
            isComplex = True

        return  { 'data': data.tolist(), 'shape': data.shape, 'isComplex':isComplex }

def get_node_value_type(node_id):
    node = current_graph.getNode(node_id)
    return str(type(node.value))

def get_node_value_shape(node_id):
    node = current_graph.getNode(node_id)

    if node.value is None:
        return None

    if isinstance(node.value, np.ndarray) or isinstance(node.value, NodeDataset):
        return node.value.shape

    if isinstance(node.value, DataGroup):
        ds = list(node.value.values())[0] # Return first value 
        return ds.shape

    if isinstance(node.value, list):
        return node.value[0]['fullshape']

    if 'fullshape' in node.value:
        return node.value['fullshape']

def get_node_value_dims(node_id):
    node = current_graph.getNode(node_id)

    if node.value is None:
        return None

    if isinstance(node.value, NodeDataset):
        return node.value.dims

    if isinstance(node.value, DataGroup):
        ds = list(node.value.values())[0] # Return first value 

        if isinstance(ds, NodeDataset):
            return ds.dims
        else:
            return []

def get_node_value_isComplex(node_id):
    node = current_graph.getNode(node_id)

    if node.value is None:
        return None

    if isinstance(node.value, np.ndarray) or isinstance(node.value, NodeDataset):
        return np.iscomplexobj(node.value[:])

    if isinstance(node.value, DataGroup):
        ds = list(node.value.values())[0] # Return first value 
        return np.iscomplexobj(ds[:])

    if 'isComplex' in node.value:
        return node.value['isComplex']

def get_node_view_metadata(node_id):
    return { 'shape': get_node_value_shape(node_id), 'dims': get_node_value_dims(node_id), 'isComplex': get_node_value_isComplex(node_id) } 

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
        return None

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
    if data is None:
        return None
    
    output = data.copy()
    if 'data' in data:
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

async def run_session(node_ids):
    id = uuid.uuid1().hex

    try:
        await websocket.startSession(id)
        session_metadata = await Session.run(id, node_ids)
        process_time = session_metadata['process_time']
    except Exception as e:
        try:
            error_message = e.args[0]['error']
            nodeid = e.args[0]['nodeid']
        except Exception as e:
            error_message = str(traceback.format_exc())
            nodeid = None

        await websocket.errorSession(id, nodeid, error_message)
        session_metadata = { 'message':"Error: Session runtime error.", 'error': error_message }
    else:
        await websocket.stopSession(id, process_time)
    finally:
        return session_metadata

def get_examples():
    with open('./nodestudio/api/examples.json') as json_file:
        data = json.load(json_file)
        return data
    
def set_examples(data):
    with open('./nodestudio/api/examples.json', 'w') as outfile:
        json.dump(data, outfile, ensure_ascii=False, indent=4)

def get_path_query(relative_path):
    data = path.query_path(relative_path)
    return { 'path': data[0], 'folders': data[1], 'files': data[2] }

def get_files():
    return [ { 'id':file['id'], 'path':file['path'], 'name':file['name'], 'type':file['type'] } for file in io.files_loaded.values() ]

def get_file_data(file, key):
    data = io.get_filedata(file)
    encoded = encode_data(data, key)
    return encoded

def get_file_preview_img(file, size = 128):
    data = io.get_filedata(file)
    
    ''' Generate key for preview img'''
    shape = data.shape
    indices = [math.floor(s / 2) for s in shape ]
    key = '['
    for dim, index in enumerate(indices):
        if dim == 1 or dim == 2:
            key += ':'
        else:
            key += str(index)
        if dim < len(indices) - 1:
            key += ','
    key += ']'

    data = eval(f'data{key}')

    if np.iscomplexobj(data):
        data = np.abs(data)
    min = float(np.nanmin(data))
    max = float(np.nanmax(data))
    scaled_data = (data - min) * 255 / (max - min)
    scaled_data = np.uint8(scaled_data)

    buffered = BytesIO()
    im = Image.fromarray(np.uint8(scaled_data))
    im = im.resize((size, size))
    im.save(buffered, format="PNG")
    return "data:image/png;base64," + base64.b64encode(buffered.getvalue()).decode()

def read_file(filepath):
    io.read_file(filepath)
    return get_files()

def update_filename(id, name):
    io.files_loaded[id]['name'] = name
    return get_files()
