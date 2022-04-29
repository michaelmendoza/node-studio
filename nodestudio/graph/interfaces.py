from typing import Any, List, Dict
from pydantic import BaseModel

class NodeData(BaseModel):
    id: str
    props: Any
    inputs: List[str] = []
    outputs: List[str] = []
    styles: Any
    args: Any

class LinkData(BaseModel):
    id: str
    startNode: str
    startPort: int
    endNode: str
    endPort: int

class ExampleData(BaseModel):
    name: str
    description: str
    graph: Any

class JsonData(BaseModel):
    json_string: str

class ID_Data(BaseModel):
    id:str
