
class Filter {

	createShadowFilter(svg) {
		// filters go in defs element
		var defs = svg.append("defs");

		// create filter with id #drop-shadow
		// height=130% so that the shadow is not clipped
		var filter = defs.append("filter")
		    .attr("id", "drop-shadow")
		    .attr("height", "130%");

		// SourceAlpha refers to opacity of graphic that this filter will be applied to
		// convolve that with a Gaussian with standard deviation 3 and store result
		// in blur
		filter.append("feGaussianBlur")
		    .attr("in", "SourceAlpha")
		    .attr("stdDeviation", 3)

		// translate output of Gaussian blur to the right and downwards with 2px
		// store result in offsetBlur
		filter.append("feOffset")
		    .attr("dx", 2)
		    .attr("dy", 2)
		    .attr("result", "offsetBlur");

		// Control opacity of shadow filter
		var feTransfer = filter.append("feComponentTransfer");
		feTransfer.append("feFuncA")
			.attr("type", "linear")
			.attr("slope", 0.2)

		// overlay original SourceGraphic over translated blurred opacity by using
		// feMerge filter. Order of specifying inputs is important!
		var feMerge = filter.append("feMerge");
		feMerge.append("feMergeNode")
		feMerge.append("feMergeNode")
		    .attr("in", "SourceGraphic");	
	}	

}

export default new Filter();

