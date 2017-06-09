
class Ports {
	constructor() {
		this.ports = [];
		this.activePort = null;
	}

	clearActivePort() {
		this.activePort = null;
	}

	setActivePort(port) {
		this.activePort = port;
	}
}

export default new Ports();