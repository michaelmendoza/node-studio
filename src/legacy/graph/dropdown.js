
import { select } from 'd3';

class Dropdown { 
	
	constructor(node, options) {
		this.node = node;
		this.options = options;
		this.createDropdown();		
	}

	createDropdown() { 

		var node = this.node;
		var props = { showDropdown:false };

		var dropdown = node.g.append("g");
		dropdown.attr("transform", "translate(" + 20 + "," + 110 + ")")
		 .attr("class", 'dropdown')

		var box = dropdown.append("rect")
			.attr("x", 0).attr("y", 0)	 
			.attr("rx", 6).attr("ry", 6)
			.attr("width", 100).attr("height", 20)
			.style("fill", '#FEFEFE')
			.style("stroke", "AAAAAA")
			.style("stroke-width", 1)

		var text = dropdown.append("text")
			.attr('class', 'display-text')
			.attr("x", 20).attr("y", 14)
			.attr("font-size", 10)
			.text('Select Mode')

		box.on('mouseover', () => { box.style("fill", '#CECECE') })
		box.on('mouseleave', () => { box.style("fill", '#FEFEFE') })
		
		box.on('click', () => { 
			if(!props.showDropdown) {
				dropdown.select('.display-text').text('Select Mode');

				var list = dropdown.append('g')
					.attr('class', 'dropdown-list')
					.attr("transform", "translate(" + 0 + "," + 20 + ")")

				list.append("rect")
					.attr('class', 'list')
					.attr("x", 0).attr("y", 0)
					.attr("width", 100).attr("height", this.options.length * 10 + 20)
					.style("fill", '#FEFEFE')
					.style("filter", "url(#drop-shadow)") 

				var optionsBox = list.selectAll('rect.optionsbox')
					.data(this.options)
					.enter()
					.append('rect')
					.attr("class", 'optionsbox')
					.attr('x', 0)
				  .attr('y', (d, i) => { return i * 20; })
					.attr("width", 100).attr("height", 20)
					.style("fill", '#FEFEFE')
					.style("stroke", "AAAAAA")
					.style("stroke-width", 1)

				var options = list.selectAll('text')
					.data(this.options)
					.enter()
					.append('text')
					.attr('x', 10)
				  .attr('y', (d, i) => { return i * 20 + 15; })
					.text((d) => { return d; })
					.attr("font-size", 10)

				/** Handle selecting an image in the list of image files */
				optionsBox.on('click', (d) => { 
					console.log(d);
					this.node.selectedMode = d;
					dropdown.selectAll(".dropdown-list").remove();
					dropdown.select('.display-text').text(d);
					props.showDropdown = !props.showDropdown;
				 })
			}
			else {
				dropdown.selectAll(".dropdown-list").remove();
			}
			
			props.showDropdown = !props.showDropdown;
		})

	}

}

export default Dropdown;