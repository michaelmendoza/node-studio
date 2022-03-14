import './ImageView.scss';
import { useState, useEffect, useContext } from 'react';
import { DrawImg } from '../../libraries/draw/Draw';
import { decodeDataset } from '../../libraries/signal/Dataset';
import { throttle } from '../../libraries/utils';
import APIDataService from '../../services/APIDataService';
import { ActionTypes } from '../../state/AppReducers';
import AppState from '../../state/AppState';
import DefaultImg from '../../images/default_image_icon.png';
import Select from '../base/Select';
import Slider from '../base/Slider';

const ImageView = ({nodeID}) => {
    const {state, dispatch} = useContext(AppState.AppContext);
    const [imageData, setImageData] = useState(DefaultImg);
    const [slice, setSlice] = useState('xy');
    const [sliceMax, setSliceMax] = useState(100);
    const [index, setIndex] = useState(0);
    const [shape, setShape] = useState([160, 640, 640]);

    useEffect(() => {
        if (state.sessions[nodeID]) fetchData(slice, index);
    }, [state.sessions])

    const fetchData = (slice, index) => {
        throttle(async () => {
            const encodedData = await APIDataService.getNode(nodeID, slice, index);
            if(encodedData) {
                const dataset = decodeDataset(encodedData);
                const dataUri = DrawImg(dataset);
                setImageData(dataUri);
                setShape(dataset.fullshape);
                updateSliceMax(slice);
                dispatch({type:ActionTypes.UPDATE_SESSION, nodeID, update:false});
            }
        })
    }

    const handleOptionUpdate = (option) => {
        setSlice(option.value);
        if (state.sessions[nodeID] !== undefined) {
            const index = updateSliceMax(option.value);
            fetchData(option.value, index);
        }
    }

    const handleIndexUpdate = (value) => {
        setIndex(value);
        if (state.sessions[nodeID] !== undefined)
            fetchData(slice, value) ;
    }

    const updateSliceMax = (slice) => {
        let maxIndex;
        if (slice === 'xy')
            maxIndex = shape[0];
        if (slice === 'xz')
            maxIndex = shape[1];
        if (slice === 'yz')
            maxIndex = shape[2];
        setSliceMax(maxIndex);

        if (index > maxIndex) {
            setIndex(maxIndex-1);
            return maxIndex-1;
        }
        return index;
    }

    const options = [{label:'xy', value:'xy'}, {label:'xz', value:'xz'}, {label:'yz', value:'yz'}]

    return (
        <div className="image-view">
            <img src={imageData} alt='viewport'/>
            <Select options={options} placeholder={'Select Slice'} onChange={handleOptionUpdate}></Select>
            <Slider label={'Index'} value={index} onChange={handleIndexUpdate} max={sliceMax}></Slider>
        </div>
    )
}

export default ImageView;