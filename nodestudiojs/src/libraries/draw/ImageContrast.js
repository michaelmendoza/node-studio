export default getnewContrastImage = (levelIndex, widthIndex, resolution, value)=>{
    const min = levelIndex - widthIndex/2.0;
    const output = (resolution/widthIndex)*(value - min);
    output = output<0?0:output;
    output = output>resolution?resolution:output;
    return output;
}