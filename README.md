# NodeStudio

NodeStudio is an open-source node-based imaging processing web platform created to facilitate the design, development, and standardization of medical imaging analysis pipelines. It is designed to allow researchers to easily build, design and deploy advanced algorithms and techniques using a visual programming node editor.

NodeStudio was developed to enable researchers to build complex imaging processing pipelines visually using a computation graph. A visual computation graph is a method for the design of complex algorithms without writing a single line of code. Instead of writing code, the user can visually assemble node networks in a cross-platform web application. NodeStudio gives rapid feedback that reflects network changes. It is designed to be simple to use and doesn’t require the knowledge of Python or any standard programming languages. This platform also supports multi-vendor MRI data, the integration of custom Python code, and the integration of third-party packages the deep learning framework DOSMA. As a tool for musculoskeletal MRI analysis, the platform supports several techniques for quantitative MR analysis.

This project is active development. An Alpha release is planned for July 2022.  

![nodestudio example pipeline](https://github.com/michaelmendoza/node-studio/blob/master/media/design/ExampleSegmentationPipeline.png)
Figure: An Example of a Quantitative MR Analysis Pipeline with NodeStudio User Interface

# Development 

## Local Development

Frontend javascript code located in nodestudiojs. Backend python server code located in nodestudio

To run locally frontend: ( From project root directory )
- Setup nodejs third party packages (uses npm install)
```
npm run build
```
- To run frontend react server
``` 
npm start
```

To run locally backend api server: ( From project root directory )

- Setup conda enviroment 

You have two options: 

1. Create a new conda environment from scatch 
> ```
> conda create -n nodestudio python=3.8 
> conda activate nodestudio
> ```
> Then install packages with pip using requirements file 
> ```
> pip install -r requirements.txt
> ```
> or by individual package
> ```
> pip install numpy matplotlib scipy scikit-image 
> pip install uvicorn fastapi pydantic pymongo jsonpickle tqdm jupyterlab ipywidgets pdf2image python-socketio websockets
> pip install pydicom==2.0.0 pymapvbvd dosma tensorflow
> ```

2. Use the yml file to setup the conda environment with required packages

> ```
> conda env create -f nodestudio/environment.yml
> conda activate nodestudio
> ```

- Run to API server
```
npm run api
```

## Architecture

Nodestudio is divided into a frontend react application using react and a backend server application using python. The frontend app is located in /nodestudiojs and the Backend app is located in /nodestudio. The frontend application tech stack consists of react with sass. The frontend uses fastapi for a light weight python server. 


### Frontend
```
/nodestudiojs/src
    /components - contains react application components
    /hooks - contains custom react hooks
    /libraries - contains  utility functions that don’t have side effects
    /models - contains javascript classes used as models in application state
    /services - contains functions that touch endpoints & communicate with APIs
    /state - contains app state and reducers (functions that modify state & have side-effects.)
    /styles -  scss styles
```

### Backend

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
