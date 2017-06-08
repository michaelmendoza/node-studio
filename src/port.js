
import Ports from './ports.js';

class Port {
	constructor(props) {
		this.name = props.name;
		this.value = props.value;
	}

	onHover() {
		console.log('Hover on Port - ' + this.name);
		Ports.setActivePort(this);
	}

	offHover() {
		console.log('Off Hover on Port - ' + this.name);
		Ports.clearActivePort();
	}
}

export default Port;