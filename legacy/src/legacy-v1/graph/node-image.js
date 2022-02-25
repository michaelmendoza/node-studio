
import EventEmitter from 'events';

class NodeImage extends EventEmitter {

	setImageLoader(loader) { 
		this.loader = loader;	

		this.loader.on('filesloaded', () => {
			this.emit('filesloaded');
		});
	}

	readFile(event) {
		this.loader.readFile(event);
	}

	getFiles() {
		return this.loader.files;
	}

	getLastestFile() {
		var files = this.loader.files;
		return files[files.length-1];
	}

	getLatestImage() { 
		var files = this.loader.files;
		return files[files.length-1].img.src;
	}

}

export default new NodeImage();
