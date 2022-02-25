
import ImageNode from './node-image.js';

class NodeDropdown { 
	
	constructor(node) {
		this.node = node;
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
			.attr("x", 20).attr("y", 14)
			.attr("font-size", 10)
			.text('Select Image')

		box.on('mouseover', () => { box.style("fill", '#CECECE') })
		box.on('mouseleave', () => { box.style("fill", '#FEFEFE') })
		box.on('click', () => { 
			if(!props.showDropdown) {
				var data = ImageNode.getFiles();
				var index = 0;
				data.forEach((d) => { d.index = index++; })

				var list = dropdown.append('g')
					.attr('class', 'dropdown-list')
					.attr("transform", "translate(" + 0 + "," + 20 + ")")

				list.append("rect")
					.attr('class', 'list')
					.attr("x", 0).attr("y", 0)
					.attr("width", 100).attr("height", index * 50 + 20)
					.style("fill", '#FEFEFE')
					.style("filter", "url(#drop-shadow)") 

				var options = list.selectAll('image')
					.data(data)
					.enter()
					.append('image')
					.attr("xlink:href", (d) => { return d.img.src; })
					.attr('x', 30)
				  .attr('y', (d) => { return d.index * 50 + 15 })
				  .attr('width', 40)

				/** Handle selecting an image in the list of image files */
				options.on('click', (d) => { 
					node.file = d;
					node.svg.selectAll('.' + node.id)
						.append('image')
						.attr("xlink:href", d.img.src)
						.attr('x', node.width / 2 - 40 / 2)
						.attr('y', 40).attr('width', 40)
				 	dropdown.selectAll(".dropdown-list").remove();
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

export default NodeDropdown;