import traceback
from typing import List
from functools import wraps
from fastapi import APIRouter, HTTPException
from api import controllers
from graph.interfaces import JsonData, ID_Data, NodeData, LinkData, GraphData

def handle_exception(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            data = await func(*args, **kwargs)
        except Exception as e:
            error_message = str(traceback.format_exc())
            print(error_message)
            raise HTTPException(status_code=500, detail = {'message':"Error", 'error':error_message} )
        else:
            return data

    return wrapper

router = APIRouter(prefix="/api")

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

@router.get("/node")
@handle_exception
async def get_node(node_id: str, slice: str, index: int):
    ''' Gets node data for given node_id '''
    data = controllers.get_node_data(node_id, slice, index)
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
    data = controllers.run_session(data)
    return { 'message': 'Completed sesson', 'data': data }

@router.get("/examples")
@handle_exception
async def get_examples():
    ''' Retrieves examples '''
    data = controllers.get_examples()
    return { 'message': 'Retrieved Examples', 'data': data }

@router.post("/examples")
@handle_exception
async def set_examples(data: GraphData):
    ''' Updates examples '''
    data = controllers.set_examples(data)
    return { 'message': 'Updated Examples', 'data': data }