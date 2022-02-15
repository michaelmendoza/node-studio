import { mean, std } from "./Stats";

export const createHistogram = (pixelArray) => {
    // Generate history of pixelArray
    
    const histogram = {};
    for (let i = 0; i < pixelArray.length; i++) {
        const value = pixelArray[i];
        histogram[value] = (histogram[value] === undefined) ? 0 : histogram[value] + 1;
    }

    return histogram;
}

export const generateStats = (histogram) => {
    // Generate data statistics for a histogram

    const values = Object.keys(histogram).map((x) => parseInt(x))
    const stats = {}
    stats.max = Math.max(...values);
    stats.min = Math.min(...values);
    stats.mean = mean(values);
    stats.std = std(values);
    return stats;
}