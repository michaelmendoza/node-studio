from typing import Any, List, Dict, Callable, Optional, Union
from pydantic import BaseModel
from graph.enums import NodeType, NodeDetail

# --- Data Interfaces ---

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

# --- NodeProps Interfaces ---
class NodeNumberOption(BaseModel):
    name: str
    range: List[int] = None

class NodeSelectOption(BaseModel):
    name: str
    select: List[str] = []
    default: None

class NodeBoolOption(BaseModel):
    name: str
    flag: bool
class NodeProps(BaseModel):
    type: Union[NodeType, str]
    name: str
    tags: List[str] = []
    description: str = ''
    detail: Union[NodeDetail, str] = NodeDetail.BLANK
    input: List[str] = []
    output: List[str] = []
    options: List[Union[str, Any]] = []
    fn: Callable = lambda x:x