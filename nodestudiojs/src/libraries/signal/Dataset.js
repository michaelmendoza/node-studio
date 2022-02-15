
import { base64ToPixelArray } from './PixelArray';
import { createHistogram, generateStats } from './Histogram';

export const decodeDataset = (encodedData) => {

    const pixelArray = base64ToPixelArray(encodedData.encoded);
    const histogram = createHistogram(pixelArray);
    const stats = generateStats(histogram);
    const dataset = { pixelArray, histogram, stats };
    dataset.shape = encodedData.shape;
    dataset.size = encodedData.size;

    return dataset
}