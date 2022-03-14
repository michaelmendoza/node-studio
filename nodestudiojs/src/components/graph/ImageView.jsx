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
    const [colormap,setColormap] = useState('B/W');

    useEffect(() => {
        if (state.sessions[nodeID]) fetchData(slice, index, colormap);
    }, [state.sessions])

    const fetchData = (slice, index, colormap) => {
        throttle(async () => {
            const encodedData = await APIDataService.getNode(nodeID, slice, index);
            if(encodedData) {
                const dataset = decodeDataset(encodedData);
                const dataUri = DrawImg(dataset,colormap);
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
            fetchData(option.value, index, colormap);
        }
    }

    const handleIndexUpdate = (value) => {
        setIndex(value);
        if (state.sessions[nodeID] !== undefined)
            fetchData(slice, value, colormap) ;
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
    const handleColormapChange = (option) =>{
        setColormap(option.value);
        if (state.sessions[nodeID] !== undefined) {
            fetchData(slice,index,option.value);
        }
    }

    const options = [{label:'xy', value:'xy'}, {label:'xz', value:'xz'}, {label:'yz', value:'yz'}]
    const colmap_options = [{label:'B/W', value:'bw'}, {label:'Jet', value:'jet'}]

    return (
        <div className="image-view">
            <img src={imageData} alt='viewport'/>
            <Select options={options} placeholder={'Select Slice'} onChange={handleOptionUpdate}></Select>
            <Select options={colmap_options} placeholder={'Select Color Space'} onChange={handleColormapChange}></Select>
            <Slider label={'Index'} value={index} onChange={handleIndexUpdate} max={sliceMax}></Slider>
        </div>
    )
}

export default ImageView;