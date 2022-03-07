from typing import Any, List, Dict
from pydantic import BaseModel

class NodeData(BaseModel):
    id: str
    props: Any
    inputs: List[str] = []
    outputs: List[str] = []
    styles: Any
    args: Any

class JsonData(BaseModel):
    json_string: str

class ID_Data(BaseModel):
    id:str
