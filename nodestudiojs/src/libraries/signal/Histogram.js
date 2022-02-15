import { mean, std } from "./Stats";

export const histogram = (pixelArray) => {

    const data = {};

    // Generate history of pixelArray
    data.histogram = {};
    for (let i = 0; i < pixelArray.length; i++) {
        const value = pixelArray[i];
        data.histogram[value] = (data.histogram[value] === undefined) ? 0 : data.histogram[value] + 1;
    }

    // Generate data statistics 
    const values = Object.keys(data.histogram).map((x) => parseInt(x))
    data.stats = {}
    data.stats.max = Math.max(...values);
    data.stats.min = Math.min(...values);
    data.stats.mean = mean(values);
    data.stats.std = std(values);

    return data;
}