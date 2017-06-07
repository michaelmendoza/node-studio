
class Links {
	
	constructor() {
		this.links = []
	}

	addLink(link) {
		this.links.push(link);
	}

	update() {
		this.links.forEach( (link) => {
			link.updateLink();
		})
	}

}

export default new Links();

