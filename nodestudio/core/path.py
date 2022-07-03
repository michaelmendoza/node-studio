from pathlib import Path
import os

def query_path(relative_path = None, valid_filetypes=['.dcm','.ima','.dat']):
    ''' Queries filesystem for all folders, and valid filestypes. Query is based off 
    cwd (Current Working Directory) and a relative path. Returns a queried path and list of 
    folders, and files.
    '''
    
    folders = []
    files = []
    
    # Join cwd with relative path
    if relative_path:
        path = os.path.normpath(relative_path)
        path = path.split(os.sep)
        path = Path(os.path.join(Path.cwd(), *path))
    else:
        path = Path.cwd()
    
    # Populate folders/files lists
    for item in path.iterdir():
        if os.path.isdir(item):
            folders.append(item.name)
        if os.path.isfile(item) and item.suffix in valid_filetypes:
            files.append(item.name)

    return str(path), folders, files
