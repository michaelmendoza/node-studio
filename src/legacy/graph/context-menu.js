
class ContextMenu {
	
	constructor() {
		this.g = null;	
		this.width = 60;
		this.height = 30;	
	}

	create(svg, x, y, fn) {
		this.svg = svg;
		this.g = svg.append("g");
		this.g.attr("transform", "translate(" + x + "," + y + ")");

		var box, text;
		box = this.g.append("rect")
			.attr("x", 0).attr("y", 0)	    
			.attr("width", this.width).attr("height", this.height)
			.attr("rx", 6).attr("ry", 6)
			.attr("fill", '#F7F7F7')
			.style("filter", "url(#drop-shadow)")
			.on('mouseover', () => {
				box.attr("fill", '#3B99FC')
				text.attr("fill", "#EEEEEE")
			})
			.on("mouseleave", () => {
				box.attr("fill", '#F7F7F7')
				text.attr("fill", "#222222")
			})
			.on('click', () => {
				if(fn !== undefined)
					fn();
			})

		text = this.g.append('text')
			.attr("x", this.width / 2).attr("y", 16)
			.attr("fill", "#222222")
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "central")
			.style("font-size", "12px")
			.text("Delete")	

		this.handleRemove();
	}

	handleRemove() {
		this.svg.on("click", () => {
			this.g.remove();
		})
	}

}

export default new ContextMenu();
