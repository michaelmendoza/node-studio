from fastapi import APIRouter
import base64
from io import BytesIO
from PIL import Image
import numpy as np

router = APIRouter(prefix="/test")

img = np.tile(np.linspace(0,255,640),(640,1))
buffered = BytesIO()

@router.get("/test")
async def get_test():
    ''' Retrieves the list of available nodes '''
    return { 'message': 'Retrieved data', 'data': img.tolist() }

@router.get("/test2")
async def get_test2():
    ''' Retrieves the list of available nodes '''
    min = float(np.nanmin(img))
    max = float(np.nanmax(img))
    resolution = 4096
    output = (img - min) * resolution / (max - min)
    output = np.floor(output).astype('uint16')
    encodedData = base64.b64encode(output)
    return { 'message': 'Retrieved data', 'data': encodedData }

@router.get("/test3")
async def get_test3():
    ''' Retrieves the list of available nodes '''
    resolution = np.max(img)
    sim = img * 255 / resolution
    im = Image.fromarray(np.uint8(sim))
    im.save(buffered, format="PNG")
    img_str = "data:image/png;base64," + base64.b64encode(buffered.getvalue()).decode()
    return { 'message': 'Retrieved data', 'data': img_str }

