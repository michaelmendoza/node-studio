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
    download_example1_data()
    download_dosma_example_data()
    download_rawdata()

def download_example1_data():
    ''' Downloads and extracts example data for nodestudio from google drive location '''

    # Checks if example 1 data folder exists
    example_path = "./data/examples/example1"
    example1Exists = os.path.exists(example_path)
    if example1Exists:
        print('Nodestudio Examples: Example 1 data exists')
        return

    # Downloads example 1 data
    output = './data/examples'
    print('Example 1: Downloading files ...')
    url = 'https://drive.google.com/drive/folders/1kdCB72bqZSpQqxkrVND9ZmsQydSJBG3F?usp=sharing'
    gdown.download_folder(url, quiet=False, output=output)
    print('Download complete.')

    # Extracts example data from .zip 
    filepath = './data/examples/example1_footdata.zip'
    targetdir = './data/examples/example1'
    print('Extracting files ...')
    with zipfile.ZipFile(filepath,"r") as zip_ref:
        zip_ref.extractall(targetdir)
        print('Extract complete.')
        print('Example 1 data located at: ./data/examples')

def download_dosma_example_data():
    ''' Downloads and extracts examples data for nodestudio for DOSMA '''

    # Checks if example 1 data folder exists
    example_path = "./data/examples/example2"
    example1Exists = os.path.exists(example_path)
    if example1Exists:
        print('Nodestudio Examples: Example 2 (DOSMA) data exists')
        return

    print('Example 2 (DOSMA): Downloading files ...')
    url = 'https://huggingface.co/datasets/arjundd/dosma-data/resolve/main/healthy07-knee-anonymized.zip'

    import requests, zipfile, io
    r = requests.get(url)
    print('Download complete.')

    print('Extracting files ...')
    z = zipfile.ZipFile(io.BytesIO(r.content))
    z.extractall("./data/examples/example2")
    print('Extract complete.')
    print('Example 2 data located at: ./data/examples')


def download_rawdata():
    ''' Downloads and extracts examples data for nodestudio for DOSMA '''

    # Checks if example 1 data folder exists
    example_path = "nodestudio/process/phantom/brain_phantom"
    example1Exists = os.path.exists(example_path)
    if example1Exists:
        print('Nodestudio Examples: example raw data exists')
        return

    print('Example 3 raw data: Downloading files ...')
    url = 'https://drive.google.com/file/d/1EwLIMB5JM8UJNLkD6NmzqyKMrbQvjvPB/view?usp=share_link'

    import requests, zipfile, io
    gdown.download(url, "nodestudio/process/phantom", quiet=False)
    print('Download complete.')

    print('Extracting files ...')
    
    print('Extracting files ...')
    with zipfile.ZipFile("nodestudio/process/phantom","r") as zip_ref:
        zip_ref.extractall("nodestudio/process/phantom/")

    print('Extract complete.')
    print('Example 3 raw data located at: ./data/raw_data')