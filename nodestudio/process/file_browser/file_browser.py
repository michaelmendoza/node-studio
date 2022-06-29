from pathlib import Path
import os
import numpy as np

#get current working directory
def get_current_working_directory():
    cwd = Path().absolute()
    return cwd

#display current working directory contents
def display_current_working_directory_contents():
    entries = Path.cwd()
    for entry in entries.iterdir():
        print(entry.name)
        print(entry.stem) #filename only
        print(entry.suffix) #extension only
        print(entry.stat().st_size) #file size

#up one directory level
def up_one_dir():
    os.chdir("../")

#navigate to a subdirectory
def nav_to_dir(filename):
    new_dir = os.getcwd() + filename
    os.chdir(new_dir)

#read file
def read_file(dir):
    f = Path(dir)
    f.read_text
    f.stat().st_size #file size




    


