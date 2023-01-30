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























def download_brain_phantom():
    # Downloads and extracts examples data for nodestudio from google drive location

    # Checks if example 1 data folder exists
    output = './nodestudio/process/phantom/brain_phantom'
    example1Exists = os.path.exists(output)
    if example1Exists:
        print('Nodestudio Examples: phantom data exists')
        return

    output = './nodestudio/process/phantom/'
    print('Downloading files ...')
    url = 'https://drive.google.com/drive/folders/1wJ8sZwYzAxYqco57Nq1oWuoivRp20KLA?usp=share_link'
    gdown.download_folder(url, quiet=False, output=output)
    print('Download complete.')
