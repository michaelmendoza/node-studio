function getColor(vin,colormap){
    const color = [];

    if(colormap === 'bw'){
        for(let i = 0; i < 3; i++){
            color[i] = vin * 255;
        }
    }
    else if(colormap === 'jet'){
        if(vin < 0.25){
            color[0] = 0;
            color[1] = 4 * vin * 255;
            color[2] = 255;
        }else if (vin < 0.5){
            color[0] = 0
            color[1] = 255;
            color[2] = 255 + 4 * (0.25 - vin) * 255;
        }else if (vin < 0.75){
            color[0] = 4 * (vin - 0.5) * 255;
            color[1] = 255;
            color[2] = 0;
        }else if (vin < 1){
            color[0] = 255;
            color[1] = 255 + 4 * (0.75 - vin) * 255;
            color[2] = 0;
        }else if (vin === 2){ //the NaN case
            for(let i = 0; i < 3; i++)
            color[i] = 35;
        }
    }
    else {
        for(let i = 0; i < 3; i++)
        color[i] = vin * 255;
    }
    return color;
}

const calcAlpha = (value, threshold) => {
    if(threshold === undefined) return 255;
    else return (value > threshold) ? 255 : 0;
}

const DrawCanvas = (data, colormap, threshold = undefined) => {
    const pixelArray = data.pixelArray;
    const resolution = data.isScaled ? data.resolution : data.max;
    const height = data.shape[0];
    const width = data.shape[1];

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');	
    canvas.width =  width;
    canvas.height = height;
    const imageData = context.getImageData(0, 0, width, height);

    let i = 0;
    for(let y = 0; y < height; y++)
        for(let x = 0; x < width; x++, i++) {
            const value = pixelArray[ y * width + x ];          // Pixel value
            const fValue = value / resolution;                  // Fractional value of max resolution 
            const colorValues = getColor(fValue, colormap);
            const alpha = calcAlpha(value, threshold);
            imageData.data[4*i] = colorValues[0];
            imageData.data[4*i+1] = colorValues[1];
            imageData.data[4*i+2] = colorValues[2];
            imageData.data[4*i+3] = alpha;
        }

    
    context.putImageData(imageData, 0, 0);
    return canvas;
}

export const DrawImg = (data, colormap, threshold = undefined) => {
    const canvas = DrawCanvas(data, colormap, threshold);
    const dataURL = canvas.toDataURL();    
    return dataURL; 
}

export const DrawLayers = (layers, width, height) => {
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width =  width;
    canvas.height = height;

    layers.forEach((layer) => {
        const layerCanvas = DrawCanvas(layer.data, layer.colormap, layer.threshold);
        context.globalAlpha = layer.opacity;
        context.drawImage(layerCanvas, 0, 0);
    })

    return canvas.toDataURL();
}

export const getImgPixelValue = (data, x, y) => {
    const height = data.shape[0];
    const width = data.shape[1];
    
    if (x < 0 || x > width) return null;
    if (y < 0 || y > height) return null;

    return data.pixelArray[ y * width + x ];
}
