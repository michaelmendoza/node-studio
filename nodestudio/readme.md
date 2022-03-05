
# Local Pyton enviroment

Make sure you have [miniconda](https://docs.conda.io/en/latest/miniconda.html) installed.

Run the following to create a new python environemnt with required libaries.

```
conda create -n nodestudio python=3.8 
conda activate nodestudio
pip install numpy matplotlib scipy scikit-image pydicom pymapvbvd 
pip install uvicorn fastapi pydantic pymongo jsonpickle tqdm pycairo jupyterlab 
```
