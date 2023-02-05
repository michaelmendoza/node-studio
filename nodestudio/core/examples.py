import os
import gdown
import zipfile
from core import io

def load_example_data():
    ''' Loads example file data into memory '''
    filepath_example = os.path.join(os.getcwd(), 'data', 'examples', 'example1', '')
    files = io.read_file(filepath_example, 'example1-b7027ec6f5b311ecbc2eacde48001122') #'./data/examples/example1'
    print('Example 1 data loaded: ' + files)

    filepath_dess = os.path.join(os.getcwd(), 'data', 'examples', 'example2', 'healthy07-anonymized','qdess', '')
    files = io.read_file(filepath_dess, 'example2-b7027ec6f5b311ecbc2eacde48001123') #'./data/examples/example2/healthy07-anonymized'
    print('Example 2 (DESS) data loaded: ' + files)

def download_example_data():
    ''' Downloads and extracts example data for nodestudio '''

    data_path = './data/'
    example_path = './data/examples/'
    exampleExists = os.path.exists(example_path)
    if not exampleExists:
        os.mkdir(data_path)
        os.mkdir(example_path)

    download_example1_data()
    download_dosma_example_data()
    download_phantom_data()

def download_example1_data():
    ''' Downloads and extracts example data for nodestudio from google drive location '''

    # Checks if example 1 data folder exists
    example_path = './data/examples/example1'
    exampleExists = os.path.exists(example_path)
    if exampleExists:
        print('Nodestudio Examples: Example 1 data exists')
        return
    else:
        os.mkdir(example_path)

    # Downloads example 1 data
    print('Example 1: Downloading files ...')
    url = 'https://drive.google.com/file/d/164c-yUWgnXrFKESCmiYlxX67tG1ySOY8/view?usp=sharing'
    output = './data/examples/example1_footdata.zip'
    gdown.download(url, quiet=False, output=output, fuzzy=True)
    print('Download complete.')

    # Extracts example data from .zip 
    filepath = output
    targetdir = example_path
    print('Extracting files ...')
    with zipfile.ZipFile(filepath,"r") as zip_ref:
        zip_ref.extractall(targetdir)
        print('Extract complete.')
        print(f'Example 1 data located at: ${example_path}')

    # Remove downloaded zip file 
    os.remove(output)

def download_dosma_example_data():
    ''' Downloads and extracts examples data for nodestudio for DOSMA '''

    # Checks if example 1 data folder exists
    example_path = "./data/examples/example2"
    exampleExists = os.path.exists(example_path)
    if exampleExists:
        print('Nodestudio Examples: Example 2 (DOSMA) data exists')
        return

    print('Example 2 (DOSMA): Downloading files ...')
    url = 'https://huggingface.co/datasets/arjundd/dosma-data/resolve/main/healthy07-knee-anonymized.zip'

    import requests, zipfile, io
    r = requests.get(url)
    print('Download complete.')

    print('Extracting files ...')
    z = zipfile.ZipFile(io.BytesIO(r.content))
    z.extractall(example_path)
    print('Extract complete.')
    print(f'Example 2 data located at: ${example_path}')

def download_phantom_data():
    ''' Downloads and extracts phantom data for nodestudio '''

    # Checks if example 1 data folder exists
    example_path = './nodestudio/process/phantom/data'
    exampleExists = os.path.exists(example_path)
    if exampleExists:
        print('Nodestudio Examples: example phantom data exists')
        return
    else:
        os.mkdir(example_path)

    print('Phantom data: Downloading files ...')
    url = 'https://drive.google.com/file/d/12r-w7r96Jz0fAkPQYz3TI67pBXAFcnG_/view?usp=share_link'
    output = './nodestudio/process/phantom/data/phantom_data.zip'
    gdown.download(url, quiet=False, output=output, fuzzy=True)
    print('Download complete.')
    
    # Extracts example data from .zip 
    filepath = output
    targetdir = example_path
    print('Extracting files ...')
    with zipfile.ZipFile(filepath,"r") as zip_ref:
        zip_ref.extractall(targetdir)
        print('Extract complete.')
        print(f'Phantom data located at: ${example_path}')

    # Remove downloaded zip file 
    os.remove(output)