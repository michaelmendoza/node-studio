import Regression from './regression.js';

class ImageMath {
	
	getImageData(img) {
		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		canvas.width = img.width;
		canvas.height = img.height;
		context.drawImage(img, 0, 0 );
		return context.getImageData(0, 0, img.width, img.height);
	}

	getBlankImageData(width, height) {
		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		canvas.width = width;
		canvas.height = height;		
		return context.getImageData(0, 0, width, height);
	}

	createImg(imageData) {
		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		canvas.width = imageData.width;
		canvas.height = imageData.height;

		context.putImageData(imageData, 0, 0);
		var dataURL = canvas.toDataURL();     
		var img = document.createElement('img');
		img.src = dataURL;
		return img;
	}

	addImage(imageData, imageData2, imageOut) {
		for (var i = 0; i < imageData.data.length; i += 4) {
			imageOut.data[i] = imageData.data[i] + imageData2.data[i];
			imageOut.data[i+1] = imageData.data[i+1] + imageData2.data[i+1]
			imageOut.data[i+2] = imageData.data[i+2] + imageData2.data[i+2]
			imageOut.data[i+3] = 255;
		}
	}

	invert(imageData, imageOut) {
		for (var i = 0; i < imageData.data.length; i += 4) {
			imageOut.data[i] = 255 - imageData.data[i];
			imageOut.data[i+1] = 255 - imageData.data[i+1];
			imageOut.data[i+2] = 255 - imageData.data[i+2];
			imageOut.data[i+3] = 255;
		}	
	}

	linearImageMap(x, y, imageOut) { 
		var lengthX = x.length;					// Number of images
		var lengthY = y[0].data.length; // Number of pixels
		for (var i = 0; i < lengthY; i += 4) { // Interate through pixels

			var pixelY = Array(lengthX);
			for (var j = 0; j < lengthX; j++) { // Interate through images
				var data = y[j].data;
				var avg = (data[i] + data[i +1] + data[i +2]) / 3; // Average pixel value
				pixelY[j] = Math.log(avg); // Ln(y)
			}

			var beta = Regression.linearLeastSquares(x, pixelY);

			imageOut.data[i]     = beta[0]; // red
			imageOut.data[i + 1] = beta[0]; // green
			imageOut.data[i + 2] = beta[0]; // blue
			imageOut.data[i + 3] = 255;
		} 

	}

}

export default new ImageMath();