import base64
from functools import wraps
from typing import Dict
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from api import controllers

class JsonData(BaseModel):
    json_string: str

class ID_Data(BaseModel):
    id:str

def handle_exception(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            data = await func(*args, **kwargs)
        except Exception as e:
            print('Error:', e)
            raise HTTPException(status_code=500, detail = {'message':"Error", 'error':str(e)} )
        else:
            return data

    return wrapper

router = APIRouter(prefix="/api")

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

@router.get("/node")
@handle_exception
async def get_node(node_id: str, slice: str, index: int):
    ''' Gets node data for given node_id '''
    data = controllers.get_node_data(node_id, slice, index)
    return { 'message': 'Retrieved node data', 'data': data }

@router.post("/add_node")
@handle_exception
async def add_node(data: JsonData):
    ''' Adds node to graph '''
    data = controllers.add_node(data)
    return { 'message': 'Add node to graph', 'data': data }

@router.post("/update_node")
@handle_exception
async def update_node(data: JsonData):
    ''' Adds node to graph '''
    data = controllers.update_node(data)
    return { 'message': 'Updated node', 'data': data }

@router.post("/remove_node")
@handle_exception
async def remove_node(node_id: ID_Data):
    ''' Removes node to graph '''
    data = controllers.delete_node(node_id.id)
    return { 'message': 'Removed node from graph', 'data': data }

@router.post("/add_link")
@handle_exception
async def add_link(data: JsonData):
    ''' Adds link to graph '''
    data = controllers.add_link(data)
    return { 'message': 'Add link to graph', 'data': data }

@router.post("/remove_link")
@handle_exception
async def remove_link(link_id: ID_Data):
    ''' Remove link to graph '''
    data = controllers.delete_link(link_id.id)
    return { 'message': 'Removed link from graph', 'data': data }

@router.post("/session")
@handle_exception
async def run_session(node_id: ID_Data):
    ''' Adds node to graph '''
    data = controllers.run_session(node_id.id)
    return { 'message': 'Completed sesson', 'data': { 'shape': data.shape, 'dtype': str(data.dtype), 'size': data.size } }