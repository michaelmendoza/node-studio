
export const SliceType = {
    XY:'xy',
    XZ:'xz',
    YZ:'yz'
}

export const DrawSlice2D = (data, sliceType = SliceType.XY, index = 0) => {

    const pixelArray = data.pixelArray;
    const resolution = data.stats.max;
    const depth = data.shape[0];
    const height = data.shape[1];
    const width = data.shape[2];

    // Limit index bounds
    index = Math.max(index, 0);

    const dims = {
        xy: { width: width, height: height }, 
        xz: { width: depth, height: width }, 
        yz: { width: depth, height: height }  
    };

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');		
    canvas.width = dims[sliceType].width;
    canvas.height = dims[sliceType].height;
    const imageData = context.getImageData(0, 0, dims[sliceType].width, dims[sliceType].height);

    let i = 0;
    let z = index;
    const sliceSize = width * height;
    for(let x = 0; x < width; x++)
        for(let y = 0; y < height; y++, i++)  {
            const valueZ = pixelArray[z * sliceSize + x * width + y] * 255 / resolution;
            imageData.data[4*i] = valueZ;
            imageData.data[4*i+1] = valueZ;
            imageData.data[4*i+2] = valueZ;
            imageData.data[4*i+3] = 255;
        }
    
    context.putImageData(imageData, 0, 0);
    const dataURL = canvas.toDataURL();    
    return dataURL; 
}