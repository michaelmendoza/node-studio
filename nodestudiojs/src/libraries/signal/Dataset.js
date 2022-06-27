
import { base64ToPixelArray } from './PixelArray';
import { createHistogram, generateStats } from './Histogram';

export const decodeDataset = (encodedData) => {

    const pixelArray = base64ToPixelArray(encodedData.encoded, encodedData.dtype);
    const histogram = createHistogram(pixelArray);
    const stats = generateStats(histogram);
    
    const dataset = { ...encodedData, pixelArray, histogram, stats };
    return dataset
}