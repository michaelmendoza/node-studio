import time
from fastapi import APIRouter
from api import controllers

router = APIRouter()

@router.get("/")
def read_root():
    return {"Welcome to ": "Graph Toolkit"}

@router.get("/mockdata")
async def mockdata():
    ''' Retrives mockdata '''
    start = time.time()
    data = controllers.mockdata()
    end = time.time()
    message = str("mockdata retrived in %.2f seconds" % (end - start))
    return { 'message': message, 'data': data }