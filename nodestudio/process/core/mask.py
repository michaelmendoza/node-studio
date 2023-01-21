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

def apply_threshold_mask(img, threshold):
    threshold = float(threshold)
    mask = create_threshold_mask(img, threshold)
    return img * mask

def apply_positive_mask(img, mask):
    positive_mask = mask[:] > 0
    return img[:] * positive_mask

def apply_mask(img, masktype, threshold = 0):
    ''' Mask input image data '''
    mask = create_mask(img, masktype, threshold)
    return img * mask


import numpy as np
from numpy.lib.stride_tricks import as_strided
def soft_thresh(u, lmda):
    """Soft-threshing operator for complex valued input"""
    Su = (abs(u) - lmda) / abs(u) * u
    Su[abs(u) < lmda] = 0
    return Su

def normal_pdf(length, sensitivity):
    return np.exp(-sensitivity * (np.arange(length) - length / 2)**2)

def var_dens_mask(shape, ivar, sample_high_freq=True):
    """Variable Density Mask (2D undersampling)"""
    if len(shape) == 3:
        Nt, Nx, Ny = shape
    else:
        Nx, Ny = shape
        Nt = 1

    pdf_x = normal_pdf(Nx, ivar)
    pdf_y = normal_pdf(Ny, ivar)
    pdf = np.outer(pdf_x, pdf_y)

    size = pdf.itemsize
    strided_pdf = as_strided(pdf, (Nt, Nx, Ny), (0, Ny * size, size))
    # this must be false if undersampling rate is very low (around 90%~ish)
    if sample_high_freq:
        strided_pdf = strided_pdf / 1.25 + 0.02
    mask = np.random.binomial(1, strided_pdf)

    xc = Nx // 2
    yc = Ny // 2
    mask[xc - 4:xc + 5, yc - 4:yc + 5] = True

    if Nt == 1:
        return mask.reshape((Ny, Nx))

    return mask
def undersampling_rate(mask):
    return float(mask.sum()) / mask.size
def get_phase(x):
    xr = np.real(x)
    xi = np.imag(x)
    phase = np.arctan(xi / (xr + 1e-12))
    return phase