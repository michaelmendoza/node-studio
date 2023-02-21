import time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from api import routes, websocket
from core import load_example_data

app = FastAPI()
websocket.init(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def load_examples():
    load_example_data()
    
@app.get("/")
def read_root():
    url_list = [{"path": route.path, "name": route.name} for route in app.routes]
    return {"message": "Welcome Node Studio", "routes": url_list}

app.include_router(routes.router)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response