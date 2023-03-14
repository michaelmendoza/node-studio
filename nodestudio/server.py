import uvicorn
from core import download_example_data

if __name__ == "__main__":
    download_example_data()    
    #uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True, debug=True, log_level="debug", workers=1)
    uvicorn.run("app:app", host="0.0.0.0", port=8001, reload=True, debug=True, workers=1)
