import { useState, useContext, useEffect } from 'react';
import ImageMultiLayerRenderer from '../../ImageViewer/ImageMultiLayerRenderer';
import Select from '../../base/Select';
import Slider from '../../base/Slider';
import AppState from '../../../state/AppState';
import { throttle } from '../../../libraries/utils';
import APIDataService from '../../../services/APIDataService';

const ImageLayerView = ({node, nodeID}) => {
    const {state} = useContext(AppState.AppContext);
    const [slice, setSlice] = useState({label:'XY', value:'xy'});
    const [sliceMax, setSliceMax] = useState(100);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        fetchData(slice.value, index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [node.view.update])

    const fetchData = () => {
        throttle(async () => {
            let metadata = await APIDataService.getNodeMetadata(nodeID);
            if(Array.isArray(metadata)) metadata = metadata[0];
            updateMaxSlice(metadata.fullshape);           
        })
    }

    const handleOptionUpdate = (option) => {
        setSlice(option.value);
        if (state.sessions[nodeID] !== undefined) {
            fetchData();
        }
    }

    const handleIndexUpdate = (value) => {
        setIndex(value);
    }

    const updateMaxSlice = (shape) => {
        const shapeIndex = ({ 'xy':0, 'xz':1, 'yz':2 })[slice.value];
        setSliceMax(shape[shapeIndex]);

        if(index > shape[shapeIndex]) {
            setIndex(shape[shapeIndex]-1)
        }
    }

    const options = [{label:'XY', value:'xy'}, {label:'XZ', value:'xz'}, {label:'YZ', value:'yz'}]

    return (
        <div className="image-view">
            <ImageMultiLayerRenderer node={node} nodeID={nodeID} slice={slice.value} index={index} useFractionalIndex={false}></ImageMultiLayerRenderer>
            <label>Slice</label>
            <Select options={options} value={slice} placeholder={'Select Slice'} onChange={handleOptionUpdate}></Select>
            <Slider label={'Index'} value={index} onChange={handleIndexUpdate} max={sliceMax}></Slider>
        </div>
    )
}

export default ImageLayerView;