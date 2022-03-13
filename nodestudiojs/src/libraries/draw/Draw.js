function getColor(vin){
    //refence: http://paulbourke.net/miscellaneous/colourspace/
    const color = [];

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
    }else {
        color[0] = 255;
        color[1] = 255 + 4 * (0.75 - vin) * 255;
        color[2] = 0;
    }
    return color;
}

export const DrawImg = (data) => {

    const pixelArray = data.pixelArray;
    const resolution = data.stats.max;
    const height = data.shape[0];
    const width = data.shape[1];

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');	
    canvas.width =  width;
    canvas.height = height;
    const imageData = context.getImageData(0, 0, width, height);

    // B/W
    // let i = 0;
    // for(let y = 0; y < height; y++)
    //     for(let x = 0; x < width; x++, i++) {
    //         const value = pixelArray[ y * width + x ] * 255 / resolution;
    //         imageData.data[4*i] = value;
    //         imageData.data[4*i+1] = value;
    //         imageData.data[4*i+2] = value;
    //         imageData.data[4*i+3] = 255;
    //     }

    // RGB colormap
    let i = 0;
    for(let y = 0; y < height; y++)
        for(let x = 0; x < width; x++, i++) {
            const value = pixelArray[ y * width + x ] / resolution;
            imageData.data[4*i] = getColor(value)[0];
            imageData.data[4*i+1] = getColor(value)[1];
            imageData.data[4*i+2] = getColor(value)[2];
            imageData.data[4*i+3] = 255;
        }

    
    context.putImageData(imageData, 0, 0);
    const dataURL = canvas.toDataURL();    
    return dataURL; 
}