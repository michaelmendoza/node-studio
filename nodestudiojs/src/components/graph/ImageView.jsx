import './ImageView.scss';
import { useState, useEffect, useContext, useRef } from 'react';
import { DrawImg, getImgPixelValue } from '../../libraries/draw/Draw';
import { decodeDataset } from '../../libraries/signal/Dataset';
import { throttle } from '../../libraries/utils';
import APIDataService from '../../services/APIDataService';
import { ActionTypes } from '../../state/AppReducers';
import AppState from '../../state/AppState';
import DefaultImg from '../../images/default_image_icon.png';
import Select from '../base/Select';
import Slider from '../base/Slider';
import Modal from '../base/Modal';

const ImageView = ({nodeID}) => {
    const {state, dispatch} = useContext(AppState.AppContext);
    const [imageData, setImageData] = useState(DefaultImg);
    const [slice, setSlice] = useState('xy');
    const [sliceMax, setSliceMax] = useState(100);
    const [index, setIndex] = useState(0);
    const [shape, setShape] = useState([160, 640, 640]);
    const [showModal, setShowModal] = useState(false);
    const [dataset, setDataset] = useState(null);

    useEffect(() => {
        if (state.sessions[nodeID]) fetchData(slice, index);
    }, [state.sessions])

    const fetchData = (slice, index) => {
        throttle(async () => {
            const encodedData = await APIDataService.getNode(nodeID, slice, index);
            if(encodedData) {
                const dataset = decodeDataset(encodedData);
                const dataUri = DrawImg(dataset);
                setDataset(dataset);
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

    const handleShowModal = () => {
        setShowModal(true)
    }


    const options = [{label:'xy', value:'xy'}, {label:'xz', value:'xz'}, {label:'yz', value:'yz'}]

    return (
        <div className="image-view" onDoubleClick={handleShowModal}>
            <img src={imageData} alt='viewport'/>
            <Select options={options} placeholder={'Select Slice'} onChange={handleOptionUpdate}></Select>
            <Slider label={'Index'} value={index} onChange={handleIndexUpdate} max={sliceMax}></Slider>
            <ImageViewModal dataset={dataset} imageData={imageData} showModal={showModal} setShowModal={setShowModal}></ImageViewModal>
        </div>
    )
}

const ImageViewModal = ({dataset, imageData, showModal, setShowModal}) => {

    const imgRef = useRef(null);
    const [position, setPosition] = useState({ x:0, y:0 })

    const handleMouseMove = (e) => {
        if(dataset === null) return;

        var rect = imgRef.current.getBoundingClientRect();
        let width = imgRef.current.clientWidth
        let height = imgRef.current.clientHeight;
        let x = Math.round(dataset.shape[1] * (e.pageX - rect.left) / width);
        let y = Math.round(dataset.shape[0] * (e.pageY - rect.top) / height);
        setPosition({ x, y });
    }

    const getImageValue = () => {
        if(dataset === null) return;
        return getImgPixelValue(dataset, position.x, position.y)
    }

    return (
        <Modal title='Image View' open={showModal} onClose={() => setShowModal(!showModal)}>
            <div style={{color:'#AAAAAA', margin:'0 0 2em 0'}}>
                <div> x: { position.x }, y:{ position.y } </div>
                <div> value: { getImageValue() } </div>
            </div>
            <div className='text-align-center'>
                <img src={imageData} alt='viewport' ref={imgRef} style={{ height: imageData === DefaultImg ? '64px' : '60vh' }} onMouseMove={handleMouseMove}/>
            </div>
        </Modal>
    )
}

export default ImageView;