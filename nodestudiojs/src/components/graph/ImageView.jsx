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

    useEffect(() => {
        if (state.sessions[nodeID]) fetchData(slice, index);
    }, [state.sessions])

    const fetchData = (slice, index) => {
        throttle(async () => {
            const encodedData = await APIDataService.getNode(nodeID, slice, index);
            const dataset = decodeDataset(encodedData);
            const dataUri = DrawImg(dataset);
            setImageData(dataUri);
            dispatch({type:ActionTypes.UPDATE_SESSION, nodeID, update:false});
        })
    }

    const handleOptionUpdate = (option) => {
        setSlice(option.value);
        if (state.sessions[nodeID] !== undefined) {
            updateSliceMax(option.value);
            fetchData(option.value, index);
        }
    }

    const handleIndexUpdate = (value) => {
        setIndex(value);
        if (state.sessions[nodeID] !== undefined)
            fetchData(slice, value) ;
    }

    const updateSliceMax = (slice) => {
        const shape = [160, 640, 640]; // TODO: Make not hard coded
        if (slice === 'xy') {
            setSliceMax(shape[0])
            if (index > shape[0]) 
                setIndex(shape[0]-1)
        }
        if (slice === 'xz') {
            setSliceMax(shape[1])
            if (index > shape[1]) 
                setIndex(shape[1]-1)
        }
        if (slice === 'yz') {
            setSliceMax(shape[2])
            if (index > shape[2]) 
                setIndex(shape[2]-1)
        }
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