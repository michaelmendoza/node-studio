
/**
 * Computes the sum of numbers.
 * @param x Input array of numbers
 */
 export const sum = (x) => {
	if(x.length === 0) return 0;
	return x.reduce(function(a, b) { return a + b; });
}

/**
 * Computes the mean of numbers. Mean is also known as the average.
 * @param x Input array of numbers
 */
export const mean = (x) => {
	if(x.length === 0) return 0;
	var sum = x.reduce(function(a, b) { return a + b; });
	var avg = sum / x.length;
	return avg;
}

/**
 * Computes the median of numbers.
 * @param x Input array of numbers
 */
export const median = (x) => {
	if(x.length === 0) return 0;
	var sortedArray = [...x];
	sortedArray.sort();
	const mid = Math.ceil(x.length / 2);
	const median = (x.length / 2) % 2 === 0 ? (sortedArray[mid] + sortedArray[mid - 1]) / 2 : sortedArray[mid - 1];
	return median;
}

/**
 * Computes the variance of numbers. Variance expectation of the squared deviation of a random variable from its mean.
 * In other words, it measures how far a set of numbers is spread out from their average value.
 * @param x Input array of numbers
 */
export const variance = (x) => {
	if(x.length === 0) return 0;
	var _mean = mean(x);
	var variance = x.reduce(function(a, b) { return a + ((b - _mean) * (b - _mean)) });
	variance = variance / x.length;
	return variance;
}

/**
 * Computes the standard deviation of numbers.
 * @param x Input array of numbers
 */
export const std = (x) => {
	return Math.sqrt(variance(x));
}