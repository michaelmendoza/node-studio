import ImageMath from "./image-math.js";

class NodeActions {
	runAction(action, args) {
		var actions = {
			add: () => { return this.runAdd(args); },
			custom: () => { return this.runCustom(args); },
			image: () => { return this.runImage(args); },
			view: () => { return this.runView(args); }
		}
		return actions[action]();
	}

	runAdd(args) {
		var node = args.node;
		var data = node.getInputNode(0).runNode();
		var data2 = node.getInputNode(1).runNode();
		var dataOut = ImageMath.getBlankImageData(data.width, data.height);
		ImageMath.addImage(data, data2, dataOut);
		return dataOut;
	}
	
	runCustom(args) {
		return null;
	}

	runImage(args) {
		return ImageMath.getImageData(args.node.img);
	}
	
	runView(args) {
		var node = args.node;
		var data = node.getInputNode(0).runNode();
		var img = ImageMath.createImg(data);
		img.onload = () => { node.createImg(img.src); }		
		return img;
	}
}

export default new NodeActions();
