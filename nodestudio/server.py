import sys, os
#sys.path.insert(0, os.getcwd())
#print('cwd:' + os.getcwd())

import time
import uvicorn
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

from api import routes, websocket
from core import io, download_example_data
from core.examples import download_dess_data

app = FastAPI()
websocket.create_websocket(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def load_examples():
    filepath_example = os.path.join(os.getcwd(), 'data', 'examples', 'example1', '')
    files = io.read_file(filepath_example, 'example1-b7027ec6f5b311ecbc2eacde48001122') #'./data/examples/example1'
    print('Example data loaded: ' + files)

    filepath_dess = os.path.join(os.getcwd(), 'data', 'examples', 'healthy07-anonymized','qdess', '')
    files = io.read_file(filepath_dess, 'example2-b7027ec6f5b311ecbc2eacde48001123') #'./data/examples/healthy07-anonymized'
    print('Example DESS data loaded: ' + files)
    


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

if __name__ == "__main__":
    download_example_data()
    download_dess_data()
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True, debug=True, workers=4)