import SimpleITK as sitk
import os
import dosma as dm
import numpy as np
from dosma import preferences
from dosma.scan_sequences import QDess, CubeQuant, Cones
from dosma.tissues import FemoralCartilage
import matplotlib.pyplot as plt
from dosma.tissues import FemoralCartilage, TibialCartilage, PatellarCartilage, Meniscus
from core.datagroup import DataGroup
from core.dataset import NodeDataset 



def registration(targetGroup, movingGroup):
    # if len(targetGroup.group) != len(movingGroup.group):
    #     raise Exception("Datagroup of different sizes, thus unabler to perform registration!")
    tsize = len(targetGroup.group)
    msize = len(movingGroup.group)

    # do registration iteratively on the if one of the group has a single dataset 
    if tsize == 1:
        for index in range (msize):
            targetDataset = targetGroup.values()[0]
            refDataset = movingGroup.values()[index]
            movingGroup.values()[index] = elastic(targetDataset.data,refDataset.data)
        return movingGroup
    if msize == 1:
        for index in range (tsize):
            targetDataset = targetGroup.values()[index]
            refDataset = movingGroup.values()[0]
            movingGroup.values()[index] = elastic(targetDataset.data,refDataset.data)
        return movingGroup
    
    # register as much as possible if if both datagroups have more than one dataset
    for index in range (np.min(tsize, msize)):
        targetDataset = targetGroup.values()[index]
        refDataset = movingGroup.values()[index]
        movingGroup.values()[index] = elastic(targetDataset.data,refDataset.data)
    return movingGroup







def elastic(target, moving):
    target = target.astype(np.float64)
    moving = moving.astype(np.float64)
    fixed_image = sitk.GetImageFromArray(target)
    moving_image = sitk.GetImageFromArray(moving)
    initial_transform = sitk.CenteredTransformInitializer(
        fixed_image,
        moving_image,
        sitk.Euler3DTransform(),
        sitk.CenteredTransformInitializerFilter.GEOMETRY,
    )
    moving_resampled = sitk.Resample(
        moving_image,
        fixed_image,
        initial_transform,
        sitk.sitkLinear,
        0.0,
        moving_image.GetPixelID(),
    )
    registration_method = sitk.ImageRegistrationMethod()
    # Similarity metric settings.
    registration_method.SetMetricAsMattesMutualInformation(numberOfHistogramBins=50)
    registration_method.SetMetricSamplingStrategy(registration_method.RANDOM)
    registration_method.SetMetricSamplingPercentage(0.01)

    registration_method.SetInterpolator(sitk.sitkLinear)

    # Optimizer settings.
    registration_method.SetOptimizerAsGradientDescent(
        learningRate=1.0,
        numberOfIterations=100,
        convergenceMinimumValue=1e-6,
        convergenceWindowSize=10,
    )
    registration_method.SetOptimizerScalesFromPhysicalShift()

    # Setup for the multi-resolution framework.
    registration_method.SetShrinkFactorsPerLevel(shrinkFactors=[4, 2, 1])
    registration_method.SetSmoothingSigmasPerLevel(smoothingSigmas=[2, 1, 0])
    registration_method.SmoothingSigmasAreSpecifiedInPhysicalUnitsOn()

    # Don't optimize in-place, we would possibly like to run this cell multiple times.
    registration_method.SetInitialTransform(initial_transform, inPlace=False)

    final_transform = registration_method.Execute(
        sitk.Cast(fixed_image, sitk.sitkFloat32), sitk.Cast(moving_image, sitk.sitkFloat32)
    )
    moving_resampled = sitk.Resample(
        moving_image,
        fixed_image,
        final_transform,
        sitk.sitkLinear,
        0.0,
        moving_image.GetPixelID(),
    )
    return sitk.GetArrayFromImage(moving_resampled).astype(np.float64)