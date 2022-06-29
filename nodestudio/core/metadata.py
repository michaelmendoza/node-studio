
class NodeMetadata:

    def __init__(self, headers, type):
        self.type = type
        self.headers = headers
        # TODO: deal with metadata case for phantom data without headers 

    def __repr__(self):
        return f'''NodeMetadata: 
    PixelSpacing:{self.pixel_spacing}  
    TE:{self.echo_time}  
    TR:{self.repetition_time}  
    FlipAngle:{self.flip_angle}'''

    @property
    def pixel_spacing(self):
        """The ``dtype`` of the ndarray. Same as ``self.volume.dtype``."""
        if self.type == 'dicom':
            dxy = self.headers[0].PixelSpacing
            dz = self.headers[0].SliceThickness
            return [float(dz), float(dxy[0]), float(dxy[1])]
        elif self.type == 'rawdata':
            ny = self.headers.Config.RawLin
            nx = self.headers.Config.RawCol
            dy = self.headers.MeasYaps[('sSliceArray', 'asSlice', '0', 'dPhaseFOV')] / nx
            dx = self.headers.MeasYaps[('sSliceArray', 'asSlice', '0', 'dReadoutFOV')] / ny
            dz = self.headers.MeasYaps[('sSliceArray', 'asSlice', '0', 'dThickness')]
            return [dz, dy, dx]

    @property
    def echo_time(self):
        ''' TE in ms '''
        if self.type == 'dicom':
            return self.headers[0].EchoTime
        elif self.type == 'rawdata':
            return self.headers.MeasYaps[('alTE', '0')] / 1000.0

    @property
    def repetition_time(self):
        ''' TE in ms '''
        if self.type == 'dicom':
            return self.headers[0].RepetitionTime
        elif self.type == 'rawdata':
            return self.headers.MeasYaps[('alTR', '0')] / 1000.0

    @property
    def flip_angle(self):
        if self.type == 'dicom':
            return self.headers[0].FlipAngle
        if self.type == 'rawdata':
            return self.headers.MeasYaps[('adFlipAngleDegree', '0')]