import time
from typing import Dict
from pydantic import BaseModel
from fastapi import APIRouter
from api import controllers

router = APIRouter()

@router.get("/")
def read_root():
    return {"Welcome to ": "Node Studio"}

class GraphData(BaseModel):
    data: Dict = {}

@router.post("/graph")
async def create_graph(data: GraphData):
    ''' Creates compuate graph '''

    start = time.time()
    data = controllers.create_graph(data)
    end = time.time()
    message = str("mockdata retrived in %.2f seconds" % (end - start))
    return { 'message': message, 'data': data }

@router.post("/add_node")
async def add_node(data: Dict):
    ''' Adds node to graph '''
    pass

@router.post("/update_node")
async def update_node(data: Dict):
    ''' Adds node to graph '''
    pass

@router.post("/remove_node")
async def remove_node(data: Dict):
    ''' Adds node to graph '''
    pass

@router.post("/add_link")
async def add_link(data: Dict):
    ''' Adds node to graph '''
    pass

@router.post("/remove_link")
async def remove_link(data: Dict):
    ''' Adds node to graph '''
    pass

@router.post("/session")
async def run_session(data: Dict):
    ''' Adds node to graph '''
    pass