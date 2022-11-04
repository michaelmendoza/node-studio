# Nodestudio - Backend Server

The nodestudio backend server is a python FastAPI server app. 

### Tech Stack

What frameworks were used? Built from using:

- fastapi, uvicorn, and pydantic for server code
- socketio for real-time sockets 
- numpy matplotlib scipy scikit-image for scientific processing
- tensorflow for machine leanring
- pydicom pymapvbvd for dicom, and raw data readers

### Backend File Structure

```
/nodestudio
    /server.py - server entrypoint
    /api - contains fastAPI server code
        /controllers - api controllers (should be lightweight)
        /routes -  api router routes
    /graph - contains code for computation graph
        /enums - contains NodeType and NodeDetail enums for node designation
        /graph - represents computation graph (built from nodes, links and sessions)
        /interfaces - interfaces for data types uses pydantic
        /link - represents node connections
        /node - represents computation node
        /nodes - contains list of NodeProps for node properties
        /session - represents computation sesssion
    /process - contains node processes computation code
        /core - base node process i.e. fft, mask, stats
        /integration/dosma - dosma intergation
        /io - io nodes i.e. file, display
        /phantom - phantom for simulation code
        /quantiative_maps - quantiative maps for tissue properies i.e. T1, T2 
        /recon - MR image reconstruction code
        /simulation - MR simulation code
    /tests - contains unit tests (TODO)
```

# Local Pyton enviroment

Make sure you have [miniconda](https://docs.conda.io/en/latest/miniconda.html) installed.

Run the following to create a new python environemnt with required libaries.

```
conda create -n nodestudio python=3.8 
conda activate nodestudio
pip install numpy matplotlib scipy scikit-image pydicom pymapvbvd 
pip install uvicorn fastapi pydantic pymongo jsonpickle tqdm jupyterlab 
```
