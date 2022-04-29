import numpy as np
from pdf2image import convert_from_path

def phantom_generator(type, fov, coil):
    '''
    -------------------------------------------------------------------------
    Parameters
    type: string
    type of phantom

    fov: scalar
    phantom dimensions

    coil: scalar 
    number of coils 
    
    -------------------------------------------------------------------------
    Returns
    data : array like
    k space data from each coil 

    -------------------------------------------------------------------------
    Notes
    -------------------------------------------------------------------------
    References:

    '''
    if type == "Shepp_logan":
        return shepp_logan(fov, coil)
    if type == "Brain":
        return brain(int(fov), int(coil))


def brain(fov, coil = 1):
    '''
    -------------------------------------------------------------------------
    Parameters
    fov: scalar
    phantom dimensions

    coil: scalar 
    number of coils 
    
    -------------------------------------------------------------------------
    Returns
    data : array like
    k space data from each coil 

    -------------------------------------------------------------------------
    References:
        [1] 
        brain phantom obatined from: http://bigwww.epfl.ch/algorithms/mriphantom/
    
    '''
    image = np.array(convert_from_path('nodestudio/process/phantom/Brain.pdf', size = (fov, fov))[0])
    image = np.asarray(np.dot(image[...,:3], [0.2989, 0.5870, 0.1140]), dtype = complex)
    im = np.repeat(image[:, :, np.newaxis], coil, axis=2)
    s = im * generate_birdcage_sensitivities(matrix_size = fov,number_of_coils = coil)
    if (coil== 1): s = np.squeeze(s, axis = 2)
    return s

def shepp_logan(fov, coil = 1):
    '''
    -------------------------------------------------------------------------
    Parameters
    fov: scalar
    phantom dimensions

    coil: scalar 
    number of coils 
    
    -------------------------------------------------------------------------
    Returns
    data : array like
    k space data from each coil 

    -------------------------------------------------------------------------
    Notes
    -------------------------------------------------------------------------
    References:
        [1] 
        analytical phantom obatined from sigpy
    
    '''
    fov = int(fov); coil = int(coil)
    im = np.repeat(shepp_logan_phantom([fov,fov])[:, :, np.newaxis], coil, axis=2)
    s = im * generate_birdcage_sensitivities(matrix_size = fov,number_of_coils = coil)
    if (coil== 1): s = np.squeeze(s, axis = 2) 
    return s
    
def generate_birdcage_sensitivities(matrix_size = 256, number_of_coils = 8, relative_radius = 1.5, normalize=True):
    """ Generates birdcage coil sensitivites.
    :param matrix_size: size of imaging matrix in pixels (default ``256``)
    :param number_of_coils: Number of simulated coils (default ``8``)
    :param relative_radius: Relative radius of birdcage (default ``1.5``)
    This function is heavily inspired by the mri_birdcage.m Matlab script in
    Jeff Fessler's IRT package: http://web.eecs.umich.edu/~fessler/code/
    """

    out = np.zeros((number_of_coils,matrix_size,matrix_size),dtype=np.complex64)
    for c in range(0,number_of_coils):
        coilx = relative_radius*np.cos(c*(2*np.pi/number_of_coils))
        coily = relative_radius*np.sin(c*(2*np.pi/number_of_coils))
        coil_phase = -c*(2*np.pi/number_of_coils)

        for y in range(0,matrix_size):
            y_co = float(y-matrix_size/2)/float(matrix_size/2)-coily
            for x in range(0,matrix_size):
                x_co = float(x-matrix_size/2)/float(matrix_size/2)-coilx
                rr = np.sqrt(x_co**2+y_co**2)
                phi = np.arctan2(x_co, -y_co) + coil_phase
                out[c,y,x] =  (1/rr) * np.exp(1j*phi)
    if normalize:
         rss = np.squeeze(np.sqrt(np.sum(abs(out) ** 2, 0)))
         out = out / np.tile(rss,(number_of_coils,1,1))
    out = np.moveaxis(out, 0 , -1)
    return out



#copied from sigpy
def shepp_logan_phantom(fov):
    """Generates a Shepp Logan phantom with a given shape and dtype.
    Args:
        shape (tuple of ints): shape, can be of length 2 or 3.
        dtype (Dtype): data type.
    Returns:
        array.
    """
    image = phantom(fov, sl_amps, sl_scales, sl_offsets, sl_angles, dtype = complex)
    return image



sl_amps = [1, -0.8, -0.2, -0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]

sl_scales = [[.6900, .920, .810],  # white big
             [.6624, .874, .780],  # gray big
             [.1100, .310, .220],  # right black
             [.1600, .410, .280],  # left black
             [.2100, .250, .410],  # gray center blob
             [.0460, .046, .050],
             [.0460, .046, .050],
             [.0460, .046, .050],  # left small dot
             [.0230, .023, .020],  # mid small dot
             [.0230, .023, .020]]

sl_offsets = [[0., 0., 0],
              [0., -.0184, 0],
              [.22, 0., 0],
              [-.22, 0., 0],
              [0., .35, -.15],
              [0., .1, .25],
              [0., -.1, .25],
              [-.08, -.605, 0],
              [0., -.606, 0],
              [.06, -.605, 0]]

sl_angles = [[0, 0, 0],
             [0, 0, 0],
             [-18, 0, 10],
             [18, 0, 10],
             [0, 0, 0],
             [0, 0, 0],
             [0, 0, 0],
             [0, 0, 0],
             [0, 0, 0],
             [0, 0, 0]]


def phantom(shape, amps, scales, offsets, angles, dtype):
    """
    Generate a cube of given shape using a list of ellipsoid
    parameters.
    """

    if len(shape) == 2:

        ndim = 2
        shape = (1, shape[-2], shape[-1])

    elif len(shape) == 3:

        ndim = 3

    else:

        raise ValueError('Incorrect dimension')

    out = np.zeros(shape, dtype=dtype)

    z, y, x = np.mgrid[-(shape[-3] // 2):((shape[-3] + 1) // 2),
                       -(shape[-2] // 2):((shape[-2] + 1) // 2),
                       -(shape[-1] // 2):((shape[-1] + 1) // 2)]

    coords = np.stack((x.ravel() / shape[-1] * 2,
                       y.ravel() / shape[-2] * 2,
                       z.ravel() / shape[-3] * 2))

    for amp, scale, offset, angle in zip(amps, scales, offsets, angles):

        ellipsoid(amp, scale, offset, angle, coords, out)

    if ndim == 2:

        return out[0, :, :]

    else:

        return out


def ellipsoid(amp, scale, offset, angle, coords, out):
    """
    Generate a cube containing an ellipsoid defined by its parameters.
    If out is given, fills the given cube instead of creating a new
    one.
    """
    R = rotation_matrix(angle)
    coords = (np.matmul(R, coords) - np.reshape(offset, (3, 1))) / \
        np.reshape(scale, (3, 1))

    r2 = np.sum(coords ** 2, axis=0).reshape(out.shape)

    out[r2 <= 1] += amp


def rotation_matrix(angle):
    cphi = np.cos(np.radians(angle[0]))
    sphi = np.sin(np.radians(angle[0]))
    ctheta = np.cos(np.radians(angle[1]))
    stheta = np.sin(np.radians(angle[1]))
    cpsi = np.cos(np.radians(angle[2]))
    spsi = np.sin(np.radians(angle[2]))
    alpha = [[cpsi * cphi - ctheta * sphi * spsi,
              cpsi * sphi + ctheta * cphi * spsi,
              spsi * stheta],
             [-spsi * cphi - ctheta * sphi * cpsi,
              -spsi * sphi + ctheta * cphi * cpsi,
              cpsi * stheta],
             [stheta * sphi,
              -stheta * cphi,
              ctheta]]
    return np.array(alpha)

