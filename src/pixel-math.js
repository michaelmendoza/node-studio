import Regression from './regression.js';

class PixelMath {
	
	add(data, data2) {
		var length = data.pixelData.length;
		var out = Array(length);
		for (var i = 0; i < length; i++) {
			out[i] = data.pixelData[i] + data2.pixelData[i];
		}
		var file = JSON.parse(JSON.stringify(data));
		file.pixelData = out;
		file.dicom.createImg = data.dicom.createImg;
		file.img = file.dicom.createImg();
		return file;
	} 

	log(x) {
		var N = x.length;
		var out = Array(N);
		for(var i = 0; i < N; i++) {
			out[i] = Math.log(x[i]);
		}
		return out;
	}

	linearImageMap(x, y, imageOut) { 
		var lengthX = x.length;						// Number of images 
		var lengthY = y[0].pixelData.length; 		// Number of pixels
		var out = Array(lengthY);
		for (var i = 0; i < lengthY; i++) { 		// Interate through pixels
			var pixels = Array(lengthX);
			for (var j = 0; j < lengthX; j++)	 	// Interate through images
				pixels[j] = y[j].pixelData[i];
			pixels = this.log(pixels);

			var beta = Regression.linearLeastSquares(x, pixels);
			out[i] = - 1 / beta[1];
			out[i] = isFinite(out[i]) ? out[i] : 0;    // If NAN or Infinity set to zero
			out[i] = (out[i] <= 4096) ? out[i] : 4096; // Temp - Bound between 4096 - 0
			out[i] = (out[i] >= 0) ? out[i] : 0; 
		} 

		var data0 = y[0];
		var file = JSON.parse(JSON.stringify(data0));
		file.pixelData = out;
		file.dicom.pixelData = out;
		file.dicom.createImg = data0.dicom.createImg;
		file.img = file.dicom.createImg();
		return file;
	}

	nonlinearImageMap(x, y, imageOut) {
		var lengthX = x.length;						// Number of images 
		var lengthY = y[0].pixelData.length; 		// Number of pixels
		var out = Array(lengthY);
		for (var i = 0; i < lengthY; i++) { 		// Interate through pixels
			var pixels = Array(lengthX);
			for (var j = 0; j < lengthX; j++)	 	// Interate through images
				pixels[j] = y[j].pixelData[i];

			var beta = Regression.nonLinearLeastSquares(x, pixels);
			out[i] = - 1 / beta[1];
			out[i] = isFinite(out[i]) ? out[i] : 0; 	// If NAN or Infinity set to zero
			out[i] = (out[i] <= 4096) ? out[i] : 4096; // Temp - Bound between 4096 - 0
			out[i] = (out[i] >= 0) ? out[i] : 0;
		} 
		
		var data0 = y[0];
		var file = JSON.parse(JSON.stringify(data0));
		file.pixelData = out;
		file.dicom.pixelData = out;
		file.dicom.createImg = data0.dicom.createImg;
		file.img = file.dicom.createImg();
		return file;
	}

}

export default new PixelMath();
