import traceback
from typing import Any, List
from functools import wraps
from fastapi import APIRouter, HTTPException
from api import controllers, websocket
from graph.interfaces import JsonData, ID_Data, NodeData, LinkData

def handle_exception(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            data = await func(*args, **kwargs)
        except Exception as e:
            error_message = str(traceback.format_exc())
            print(error_message)
            raise HTTPException(status_code=500, detail = {'message':"Error", 'error':error_message })
        else:
            return data

    return wrapper

router = APIRouter(prefix="/api")

import base64
from io import BytesIO
from PIL import Image
import numpy as np
img = np.tile(np.linspace(0,255,640),(640,1))
buffered = BytesIO()

@router.get("/test")
@handle_exception
async def get_test():
    ''' Retrieves the list of available nodes '''
    return { 'message': 'Retrieved data', 'data': img.tolist() }

@router.get("/test2")
@handle_exception
async def get_test2():
    ''' Retrieves the list of available nodes '''
    min = float(np.nanmin(img))
    max = float(np.nanmax(img))
    resolution = 4096
    output = (img - min) * resolution / (max - min)
    output = np.floor(output).astype('uint16')
    encodedData = base64.b64encode(output)
    return { 'message': 'Retrieved data', 'data': encodedData }

@router.get("/test3")
@handle_exception
async def get_test3():
    ''' Retrieves the list of available nodes '''
    resolution = np.max(img)
    sim = img * 255 / resolution
    im = Image.fromarray(np.uint8(sim))
    im.save(buffered, format="PNG")
    img_str = "data:image/png;base64," + base64.b64encode(buffered.getvalue()).decode()
    return { 'message': 'Retrieved data', 'data': img_str }

@router.get("/nodelist")
@handle_exception
async def get_graph():
    ''' Retrieves the list of available nodes '''
    data = controllers.get_nodelist()
    return { 'message': 'Retrieved nodelist', 'data': data }

@router.get("/graph")
@handle_exception
async def get_graph():
    ''' Creates compuate graph '''
    data = controllers.get_graph()
    return { 'message': 'Retrieved graph data', 'data': data }
    
@router.post("/graph")
@handle_exception
async def create_graph(data: JsonData):
    ''' Creates compuate graph '''
    data = controllers.create_graph(data)
    return { 'message': 'Created new graph', 'data': data }

@router.get("/graph/reset")
@handle_exception
async def reset_graph():
    ''' Creates compuate graph '''
    data = controllers.reset_graph()
    return { 'message': 'Reset graph', 'data': data }

@router.get("/graph/nodeview_metadata")
@handle_exception
async def get_graph_nodeview_metadata():
    ''' Creates compuate graph '''
    data = controllers.get_graph_nodeview_metadata()
    return { 'message': 'Retrieved graph nodeview metadata', 'data': data }

@router.get("/node")
@handle_exception
async def get_node(node_id: str, slice: str, index: int):
    ''' Gets node data for given node_id '''
    data = controllers.get_node_data(node_id, slice, index)
    return { 'message': 'Retrieved node data', 'data': data }

@router.get("/node/value")
@handle_exception
async def get_node(node_id: str, key: str):
    ''' Gets node data for given node_id '''
    data = controllers.get_node_value(node_id, key)
    return { 'message': 'Retrieved node data', 'data': data }

@router.get("/node/type")
@handle_exception
async def get_node(node_id: str, key: str):
    ''' Gets node data type for given node_id '''
    data = controllers.get_node_value_type(node_id)
    return { 'message': 'Retrieved node data', 'data': data }

@router.get("/node/shape")
@handle_exception
async def get_node(node_id: str):
    ''' Gets node data shape for given node_id '''
    data = controllers.get_node_value_shape(node_id)
    return { 'message': 'Retrieved node data', 'data': data }

@router.get("/node_metadata")
@handle_exception
async def get_node_metadata(node_id: str):
    ''' Gets node metadata for given node_id '''
    data = controllers.get_node_metadata(node_id)
    return { 'message': 'Retrieved node data', 'data': data }

@router.post("/node/add")
@handle_exception
async def add_node(data: NodeData):
    ''' Adds node to graph '''
    data = controllers.add_node(data)
    return { 'message': 'Add node to graph', 'data': data }

@router.post("/node/update")
@handle_exception
async def update_node(data: NodeData):
    ''' Adds node to graph '''
    data = controllers.update_node(data)
    return { 'message': 'Updated node', 'data': data }

@router.post("/node/delete")
@handle_exception
async def remove_node(data: ID_Data):
    ''' Removes node to graph '''
    data = controllers.delete_node(data.id)
    return { 'message': 'Removed node from graph', 'data': data }

@router.post("/link/add")
@handle_exception
async def add_link(data: LinkData):
    ''' Adds link to graph '''
    data = controllers.add_link(data)
    return { 'message': 'Add link to graph', 'data': data }

@router.post("/link/delete")
@handle_exception
async def remove_link(data: ID_Data):
    ''' Remove link to graph '''
    data = controllers.delete_link(data.id)
    return { 'message': 'Removed link from graph', 'data': data }

@router.post("/session")
@handle_exception
async def run_session(data: List[str]):
    ''' Adds node to graph '''
    data = await controllers.run_session(data)
    return { 'message': 'Completed sesson', 'data': data }

@router.get("/examples")
@handle_exception
async def get_examples():
    ''' Retrieves examples '''
    data = controllers.get_examples()
    return { 'message': 'Retrieved Examples', 'data': data }

@router.post("/examples")
@handle_exception
async def set_examples(data: List[Any]):
    ''' Updates examples '''
    data = controllers.set_examples(data)
    return { 'message': 'Updated Examples', 'data': data }