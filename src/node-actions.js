import ImageMath from "./image-math.js";
import PixelMath from "./pixel-math.js";

class NodeActions {
	runAction(action, args) {
		var actions = {
			add: () => { return this.runAdd(args); },
			custom: () => { return this.runCustom(args); },
			fit: ()=> { return this.runFit(args); },
			image: () => { return this.runImage(args); },
			view: () => { return this.runView(args); }
		}
		return actions[action]();
	}

	runAdd(args) {
		var node = args.node;
		var data = node.getInputNode(0).runNode();
		var data2 = node.getInputNode(1).runNode();
		var dataOut = PixelMath.add(data, data2);
		//var dataOut = ImageMath.getBlankImageData(data.width, data.height);
		//ImageMath.addImage(data, data2, dataOut);
		return dataOut; 
	}
	
	runCustom(args) {
		return null;
	}
	
	runFit(args) { 
		var node = args.node;
		var data = Array(5);
		data = node.getInputNode(0).runNode().fileset;
		var times = [30, 60, 90, 120, 150]; 

		var modes = {
			'Linear Map': () => { return PixelMath.linearImageMap(times, data); },
			'Nonlinear Map': () => { return PixelMath.nonlinearImageMap(times, data); }
		}
		
		var dataOut = modes[node.selectedMode]();
		return dataOut;
	}

	runImage(args) {
		return args.node.file;
		//return ImageMath.getImageData(args.node.img);
	}
	
	runView(args) { 
		var node = args.node;
		var data = node.getInputNode(0).runNode();
		var img = data.dicom.createImg(); // Note: Should be DICOM 
		//var img = ImageMath.createImg(data);
		img.onload = () => { node.createImg(img.src); }		
		return data;
	}
}

export default new NodeActions();
