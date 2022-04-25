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
import Planes from '../base/components/Planes';

const ImageView = ({nodeID}) => {
    const {state, dispatch} = useContext(AppState.AppContext);
    const [imageData, setImageData] = useState(DefaultImg);
    const [slice, setSlice] = useState({label:'XY', value:'xy'});
    const [sliceMax, setSliceMax] = useState(100);
    const [index, setIndex] = useState(0);
    const [shape, setShape] = useState([160, 640, 640]);
    const [showModal, setShowModal] = useState(false);
    const [dataset, setDataset] = useState(null);
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
            <ImageViewModal dataset={dataset} imageData={imageData} showModal={showModal} setShowModal={setShowModal} nodeID={nodeID} colMap = {colormap}></ImageViewModal>
        </div>
        
    )
}

const ImageViewModal = ({dataset, imageData, showModal, setShowModal, nodeID, colMap}) => {
    const [intensity, setIntensity] = useState(0)
    const imgRef = useRef(null);
    const [position, setPosition] = useState({ x:0, y:0})
    const [styles, setStyles] = useState({});

    useEffect(() => {
        updateStyles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showModal])
        
    const handleMouseMove = (e) => {
        if(dataset === null) return;

        var rect = imgRef.current.getBoundingClientRect();
        const width = imgRef.current.clientWidth
        const height = imgRef.current.clientHeight;
        const x = Math.round(dataset.shape[1] * (e.pageX - rect.left) / width);
        const y = Math.round(dataset.shape[0] * (e.pageY - rect.top) / height);
        setPosition({ x, y });
    }

    const getImageValue = () => {
        if(dataset === null) return;
        return getImgPixelValue(dataset, position.x, position.y)
    }

    const updateStyles = () => {
        if ( imageData === DefaultImg || imgRef.current === null )
            return { height: '64px'} ;

        const width = imgRef.current.clientWidth
        const height = imgRef.current.clientHeight;

        setStyles(width > height ? { width: '60vw' } : { height: '60vh' });
    }

    return (
        <Modal title='Image View' open={showModal} onClose={() => setShowModal(!showModal)}>
            <div style={{color:'#AAAAAA', margin:'0 0 2em 0'}}>
                <div> x: { position.x }, y:{ position.y } </div>
                <div> value: { getImageValue() } </div>
            </div>
            <div className='text-align-center'>
                <img src={imageData} alt='viewport' ref={imgRef} style={styles} onMouseMove={handleMouseMove}/>
            </div>
            <Planes nodeID={nodeID} dataset = {dataset} colMap = {colMap} intensity={intensity} setIntensity={setIntensity}></Planes>   
            <div style={{color:'#AAAAAA', margin:'0 0 2em 0'}}>
                <div> value: { intensity } </div>
            </div>
        </Modal>
    )
}

export default ImageView;