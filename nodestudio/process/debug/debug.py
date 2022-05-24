import time

def time_delay(data, delay = 5): 
    time.sleep(delay)
    return data

def error_node(data):
    raise Exception('Error: Debug Error Thrown')
    return data