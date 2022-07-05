import { useState, useEffect } from 'react';
import ImageMultiLayerRenderer from '../../ImageViewer/ImageMultiLayerRenderer';
import Select from '../../base/Select';
import Slider from '../../base/Slider';

const ImageLayerView = ({node, nodeID}) => {
    const [slice, setSlice] = useState({label:'XY', value:'xy'});
    const [index, setIndex] = useState(0);

    useEffect(() => {
        initalizeIndex(slice.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [node.view.update, node.view.indices])

    const initalizeIndex = (slice) => {
        let _index = 0
        if (node.view.hasData) { // Set index to middle index on view update
            const shapeIndex = ({ 'xy':0, 'xz':1, 'yz':2 })[slice];
            _index = node.view.indices[shapeIndex];
            setIndex(_index);
        }
        return _index;
    }
    
    const handleOptionUpdate = (option) => {
        setSlice(option);
    }

    const handleIndexUpdate = (value) => {
        setIndex(value);
    }

    const getMaxIndex = () => {
        if (!node.view.hasData) return 1;
        const shapeIndex = ({ 'xy':0, 'xz':1, 'yz':2 })[slice.value];
        const maxIndex = node.view.shape[shapeIndex] - 1
        if (index > maxIndex) 
            setIndex(maxIndex);
        return maxIndex ;
    }

    const options = [{label:'XY', value:'xy'}, {label:'XZ', value:'xz'}, {label:'YZ', value:'yz'}]

    return (
        <div className="image-view">
            <ImageMultiLayerRenderer node={node} nodeID={nodeID} slice={slice.value} index={index} useFractionalIndex={false}></ImageMultiLayerRenderer>
            <label>Slice</label>
            <Select options={options} value={slice} placeholder={'Select Slice'} onChange={handleOptionUpdate}></Select>
            <Slider label={'Index'} value={index} onChange={handleIndexUpdate} max={getMaxIndex()}></Slider>
        </div>
    )
}

export default ImageLayerView;