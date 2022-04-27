import './ImageView.scss';
import { useState, useEffect, useContext, useRef } from 'react';
import { DrawImg } from '../../../libraries/draw/Draw';
import { decodeDataset } from '../../../libraries/signal/Dataset';
import { throttle } from '../../../libraries/utils';
import APIDataService from '../../../services/APIDataService';
import { ActionTypes } from '../../../state/AppReducers';
import AppState from '../../../state/AppState';
import DefaultImg from '../../../images/default_image_icon.png';
import Select from '../../base/Select';
import Slider from '../../base/Slider';
import Modal from '../../base/Modal';
import ImageViewer from '../../ImageViewer';

const ImageView = ({nodeID}) => {
    const {state, dispatch} = useContext(AppState.AppContext);
    const [imageData, setImageData] = useState(DefaultImg);
    const [slice, setSlice] = useState({label:'XY', value:'xy'});
    const [sliceMax, setSliceMax] = useState(100);
    const [index, setIndex] = useState(0);
    const [shape, setShape] = useState([160, 640, 640]);
    const [showModal, setShowModal] = useState(false);
    const [colormap,setColormap] = useState({label:'B/W', value:'bw'});

    useEffect(() => {
        if (state.sessions[nodeID]) fetchData(slice.value, index, colormap.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.sessions])

    const fetchData = (slice, index, colormap) => {
        throttle(async () => {
            const encodedData = await APIDataService.getNode(nodeID, slice, index);
            if(encodedData) {
                const dataset = decodeDataset(encodedData);
                const dataUri = DrawImg(dataset, colormap);
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
            fetchData(option.value, index, colormap.value);
        }
    }

    const handleColormapChange = (option) =>{
        setColormap(option.value);
        if (state.sessions[nodeID] !== undefined) {
            fetchData(slice.value,index,option.value);
        }
    }

    const handleIndexUpdate = (value) => {
        setIndex(value);
        if (state.sessions[nodeID] !== undefined)
            fetchData(slice.value, value, colormap.value) ;
    }

    const updateSliceMax = (slice) => {
        const shapeIndex = ({ 'xy':0, 'xz':1, 'yz':2 })[slice.value];
        setSliceMax(shape[shapeIndex]);

        if (index > shape[shapeIndex]) {
            setIndex(shape[shapeIndex]-1);
            return shape[shapeIndex]-1;
        }
        return index;
    }

    const handleShowModal = () => {
        setShowModal(true)
    }

    const options = [{label:'XY', value:'xy'}, {label:'XZ', value:'xz'}, {label:'YZ', value:'yz'}]
    const colmap_options = [{label:'B/W', value:'bw'}, {label:'Jet', value:'jet'}]

    return (
        <div className="image-view" onDoubleClick={handleShowModal}>
            <img src={imageData} alt='viewport'/>
            <label>Slice</label>
            <Select options={options} value={slice} placeholder={'Select Slice'} onChange={handleOptionUpdate}></Select>
            <label>Colormap</label>
            <Select options={colmap_options} value={colormap} placeholder={'Select Color Space'} onChange={handleColormapChange}></Select>
            <Slider label={'Index'} value={index} onChange={handleIndexUpdate} max={sliceMax}></Slider>

            <Modal title='Image View' open={showModal} onClose={() => setShowModal(!showModal)}>
                <ImageViewer nodeID={nodeID}></ImageViewer>
            </Modal>

        </div>
        
    )
}

export default ImageView;