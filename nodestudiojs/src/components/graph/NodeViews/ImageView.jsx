import './ImageView.scss';
import { useState, useEffect } from 'react';
import { DrawImg } from '../../../libraries/draw/Draw';
import { decodeDataset } from '../../../libraries/signal/Dataset';
import { throttle } from '../../../libraries/utils';
import APIDataService from '../../../services/APIDataService';
import Select from '../../base/Select';
import Slider from '../../base/Slider';
import Modal from '../../base/Modal';
import ImageViewer from '../../ImageViewer';

const ImageView = ({ node }) => {
    const [imageData, setImageData] = useState(null);
    const [slice, setSlice] = useState({label:'XY', value:'xy'});
    const [colormap,setColormap] = useState({label:'B/W', value:'bw'});
    const [index, setIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        let _index = initalizeIndex(slice.value);
        fetchData(slice.value, _index, colormap.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [node.view.update, node.view.indices])

    const fetchData = (slice, index, colormap) => {
        throttle(async () => {
            if (!node.view.hasData) return;

            const startTime = performance.now();
            const encodedData = await APIDataService.getNode(node.id, slice, index);
            const endTime = performance.now();
            console.log('D Time: ' + (endTime-startTime));
            if(encodedData) {
                const dataset = decodeDataset(encodedData);
                const dataUri = DrawImg(dataset, colormap);
                setImageData(dataUri);
            }
        }, 100, node.id)
    }

    const handleSliceUpdate = (option) => {
        setSlice(option);
        let _index = initalizeIndex(option.value);
        if (node.view.hasData) fetchData(option.value, _index, colormap.value);
    }

    const handleColormapChange = (option) =>{
        setColormap(option);
        if (node.view.hasData) fetchData(slice.value, index, option.value);
    }

    const handleIndexUpdate = (value) => {
        setIndex(value);
        const shapeIndex = ({ 'xy':0, 'xz':1, 'yz':2 })[slice.value];
        node.view.updateIndex(shapeIndex, value);
        if (node.view.hasData) fetchData(slice.value, value, colormap.value) ;
    }

    const initalizeIndex = (slice) => {
        let _index = 0
        if (node.view.hasData) { // Set index to middle index on view update
            const shapeIndex = ({ 'xy':0, 'xz':1, 'yz':2 })[slice];
            _index = node.view.indices[shapeIndex];
            setIndex(_index);
        }
        return _index;
    }

    const getMaxIndex = () => {
        if (!node.view.hasData) return 1;
        const shapeIndex = ({ 'xy':0, 'xz':1, 'yz':2 })[slice.value];
        const maxIndex = node.view.shape[shapeIndex] - 1
        if (index > maxIndex) 
            setIndex(maxIndex);
        return maxIndex ;
    }

    const handleShowModal = () => {
        setShowModal(true)
    }

    const options = [{label:'XY', value:'xy'}, {label:'XZ', value:'xz'}, {label:'YZ', value:'yz'}]
    const colmap_options = [{label:'B/W', value:'bw'}, {label:'Jet', value:'jet'}]

    return (
        <div className="image-view" onDoubleClick={handleShowModal}>
            <label>Slice</label>
            <Select options={options} value={slice} placeholder={'Select Slice'} onChange={handleSliceUpdate}></Select>
            <label>Colormap</label>
            <Select options={colmap_options} value={colormap} placeholder={'Select Color Space'} onChange={handleColormapChange}></Select>
            { imageData ? <Slider label={'Index'} value={index} onChange={handleIndexUpdate} max={getMaxIndex()}></Slider> : null }
            { imageData ? <img src={imageData} alt='viewport'/> : null}

            <Modal title='Image View' open={showModal} onClose={() => setShowModal(!showModal)}>
                <ImageViewer node={node} nodeID={node.id}></ImageViewer>
            </Modal>

        </div>
        
    )
}

export default ImageView;