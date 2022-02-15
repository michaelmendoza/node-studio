
export const DrawImg = (data) => {

    const pixelArray = data.pixelArray;
    const resolution = data.stats.max;
    const width = data.shape[1];
    const height = data.shape[0];

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');		
    canvas.width =   width;
    canvas.height = height;
    const imageData = context.getImageData(0, 0, width, height);

    let i = 0;
    for(let x = 0; x < width; x++)
        for(let y = 0; y < height; y++, i++)  {
            const value = pixelArray[ x * width + y ] * 255 / resolution;
            imageData.data[4*i] = value;
            imageData.data[4*i+1] = value;
            imageData.data[4*i+2] = value;
            imageData.data[4*i+3] = 255;
        }
    
    context.putImageData(imageData, 0, 0);
    const dataURL = canvas.toDataURL();    
    return dataURL; 
}