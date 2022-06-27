import { range } from "../utils";

/**
 * Transforms two arrays (XYArray) into an array of points.
 * @param x array
 * @param y array
 */
export const toPointArray = (x, y) => {
    if (!y) {
        y = x;
        x = range(0, y.length);
    }

	const data = [];
	for (let i = 0; i < x.length; i++) {
		data.push({ x: x[i], y: y[i] });
	}
	return data;
};

/**
 * Transforms an array of points into an two arrays (XYArray).
 * @param points 
 */
export const toXYArray = (points) => {
	const x = [];
	const y = [];
	for (let i = 0; i < points.length; i++) {
		x.push(points[i].x);
		y.push(points[i].y);
	}
	return { x, y };
};
    
/**
 * Return evenly spaced numbers over a specified interval.
 * @param min The starting value of the sequence
 * @param max The end value of the sequence
 * @param N Number of samples to generate. Default is 50. Must be non-negative.
 */
export const linspace = (min, max, N = 50) => {
	const x = new Array(N);
	const step = (max - min) / N;
	for (let i = 0; i < N; i++) x[i] = min + i * step;
	return x;
};

/**
 * Computes gaussian values with mean, and std.
 * @param x Input array
 * @param mean Mean
 * @param std Standard deviation
 */
export const gaussian = (x, mean, std) => {
	const length = x.length;
	const y = new Array(length);
	const alpha = (1 / (std * Math.sqrt(2 * Math.PI)));
	const beta = -1 / (2 * std * std);
	for (let i = 0; i < length; i++) y[i] = alpha * Math.exp(beta * (x[i] - mean) * (x[i] - mean));
	return y;
};

/**
 * Returns a random values (uniform distribution) between min and max.
 * @param min Min value
 * @param max Max value
 * @param N Number of samples to generate
 */
export const random = (min, max, N = 1) => {		
	const array = [];
	for (let i = 0; i < N; i++) {
		array.push(Math.random() * (max - min) + min);
	}
	return array;
};

/**
 * Returns a random integer values (uniform distribution) between min and max.
 * @param min min value
 * @param max max value
 * @param N Number of samples to generate
 */
export const randomInt = (min, max, N = 1) => {
	const array = [];
	for (let i = 0; i < N; i++) {
		array.push(Math.round(Math.random() * (max - min) + min));
	}
	return array;
};
    
/**
 * Computes a linear regression model with alpha and beta.
 * @param x Input array
 * @param alpha constant model coefficient
 * @param beta linear model coefficeint (first-order)
 */
export const linearModel = (x, alpha, beta) => {
	const y = x.map((x) => alpha + beta * x);
	return y;
};
    
/**
 * Computes gaussian values with mean, and std. Output is formated an a point array.
 * @param x Input array
 * @param min Min input value
 * @param max Max input value
 * @param N Number of samples to generate
 * @param mean Mean
 * @param std Standard deviation
 */
export const gaussianModel = (min, max, N, mean, std) => {
	const x = linspace(min, max, N);
	const y = gaussian(x, mean, std);
	return toPointArray(x, y);
};
