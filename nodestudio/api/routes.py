import base64
from typing import Dict
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from api import controllers

class JsonData(BaseModel):
    json_string: str

class ID_Data(BaseModel):
    id:str

router = APIRouter(prefix="/api")

@router.get("/graph")
async def get_graph():
    ''' Creates compuate graph '''

    try:
        data = controllers.get_graph()
    except Exception as e:
        print('Error: Graph unable to save to json string.', e)
        raise HTTPException(status_code=500, detail = {'message':"Error: Unable to get graph", 'error':str(e)} )
    else:
        return { 'message': 'Retrieved graph data', 'data': data }

@router.post("/graph")
async def create_graph(data: JsonData):
    ''' Creates compuate graph '''

    try:
        data = controllers.create_graph(data)
    except Exception as e:
        print('Error: Graph unable to be created.', e)
        raise HTTPException(status_code=500, detail= {'message':"Error: Unable to create graph", 'error':str(e)} )
    else:
        return { 'message': 'Created new graph', 'data': data }

@router.post("/add_node")
async def add_node(data: JsonData):
    ''' Adds node to graph '''
    try:
        data = controllers.add_node(data)
    except Exception as e:
        print('Error: Graph unable to add node.', e)
        raise HTTPException(status_code=500, detail= {'message':"Error: Unable to add node", 'error':str(e)} )
    else:
        return { 'message': 'Add node to graph', 'data': data }

@router.post("/update_node")
async def update_node(data: JsonData):
    ''' Adds node to graph '''
    try:
        data = controllers.update_node(data)
    except Exception as e:
        print('Error: Graph unable to update node.', e)
        raise HTTPException(status_code=500, detail= {'message':"Error: Unable to update node", 'error':str(e)} )
    else:
        return { 'message': 'Updated node', 'data': data }

@router.post("/remove_node")
async def remove_node(node_id: ID_Data):
    ''' Removes node to graph '''
    try:
        data = controllers.delete_node(node_id.id)
    except Exception as e:
        print('Error: Graph unable to delete node.', e)
        raise HTTPException(status_code=500, detail= {'message':"Error: Unable to remove node", 'error':str(e)} )
    else:
        print('Graph created.')
        return { 'message': 'Removed node from graph', 'data': data }

@router.post("/add_link")
async def add_link(data: JsonData):
    ''' Adds link to graph '''
    try:
        data = controllers.add_link(data)
    except Exception as e:
        print('Error: Graph unable to add link.', e)
        raise HTTPException(status_code=500, detail= {'message':"Error: Unable to add link", 'error':str(e)} )
    else:
        return { 'message': 'Add link to graph', 'data': data }

@router.post("/remove_link")
async def remove_link(link_id: ID_Data):
    ''' Remove link to graph '''
    try:
        data = controllers.delete_link(link_id.id)
    except Exception as e:
        print('Error: Graph unable to remove link.', e)
        raise HTTPException(status_code=500, detail= {'message':"Error: Unable to remove link", 'error':str(e)} )
    else:
        return { 'message': 'Removed link from graph', 'data': data }

@router.post("/session")
async def run_session(node_id: ID_Data):
    ''' Adds node to graph '''
    try:
        data = controllers.run_session(node_id.id)
        encodedData = base64.b64encode(data)
    except Exception as e:
        print('Error: Graph unable run session.', e)
        raise HTTPException(status_code=500, detail= {'message':"Error: Unable to add link", 'error':str(e)} )
    else:
        
        return { 'message': 'Completed sesson', 'data': { 'encoded': encodedData, 'shape': data.shape, 'dtype': str(data.dtype), 'size': data.size } }