import numpy as np

def create_mask(input, masktype, threshold):
    ''' Create a mask for image processing based on input options. '''
    if masktype == 'circular':
        d = input.shape[0]
        h = input.shape[1]
        w = input.shape[2]
        mask = create_circular_mask2d(h, w)
        mask = np.reshape(mask, (1, h, w))
        mask = np.repeat(mask, d, axis=0)
        return mask
    if masktype == 'threshold':
        return create_threshold_mask(input, threshold)

def create_circular_mask2d(h, w, center=None, radius=None):
    ''' Creates a circular mask with height (h) and width (w) '''

    if center is None: # use the middle of the image
        center = (int(w/2), int(h/2))
    if radius is None: # use the smallest distance between the center and image walls
        radius = min(center[0], center[1], w-center[0], h-center[1])

    Y, X = np.ogrid[:h, :w]
    dist_from_center = np.sqrt((X - center[0])**2 + (Y-center[1])**2)

    mask = dist_from_center <= radius
    return mask

def create_threshold_mask(img, threshold):
    ''' Creates a threshold mask'''
    mask = img > threshold
    return mask 

def apply_mask(img, masktype, threshold = 0):
    ''' Mask input image data '''
    mask = create_mask(img, masktype, threshold)
    return img * mask
