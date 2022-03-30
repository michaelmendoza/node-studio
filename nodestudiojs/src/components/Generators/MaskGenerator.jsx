import './MaskGenerator.scss';
import { useState, useEffect } from 'react';
import { DrawImg } from '../../libraries/draw/Draw';
import Modal from '../base/Modal';

const zerosMask = (width = 64, height = 64) => {
    const uint8Array = new Uint8Array(width * height);
    for (var i = 0; i < width * height; i++) {
        uint8Array[i] = 0;
    }

    const data = {}
    data.pixelArray = uint8Array;
    data.isScaled = true;
    data.resolution = 1;
    data.shape = [height, width];
    return data;
}

const onesMask = (width = 64, height = 64) => {
    const uint8Array = new Uint8Array(width * height);
    for (var i = 0; i < width * height; i++) {
        uint8Array[i] = 1;
    }

    const data = {}
    data.pixelArray = uint8Array;
    data.isScaled = true;
    data.resolution = 1;
    data.shape = [height, width];
    return data;
}

const updateMask = (dataset, position, value) => {
    const width = dataset.shape[1];
    dataset.pixelArray[width * position.y + position.x] = value;
    return dataset;
}

const MaskGeneratorView = () => {

    const [width, setWidth] = useState(64);
    const [height, setHeight] = useState(64);
    const [position, setPosition] = useState({ x:0, y:0 });
    const [dataset, setDataset] = useState(zerosMask())
    const [imageData, setImageData] = useState(null);
    const [mask, setMask] = useState(false);

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = () => {
        const dataUri = DrawImg(dataset);
        setImageData(dataUri)
    }

    const handleMouseDown = () => {
        setMask(true);
    }

    const handleMouseUp = () => {
        setMask(false);
    }

    const handleHover = (e) => {
        var sx = e.target.width / width;
        var sy = e.target.height / height;
        var rect = e.target.getBoundingClientRect();
        var x = Math.round((e.clientX - rect.left) / sx); // x position within the element.
        var y = Math.round((e.clientY - rect.top) / sy);  // y position within the element.
        setPosition({ x, y });

        if(mask) {
            const dataUri = DrawImg(updateMask(dataset, { x, y }, 1))
            setImageData(dataUri)
        }
    }

    return (
        <div className='mask-generator-view'>
            <div className='position-output'>
                (x: {position.x}, y: {position.y})
            </div>
            <div onMouseMove={handleHover} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
                <img src={imageData} style={{ width:'100%' }}  draggable="false" alt='mask'/> 
            </div>
        </div>
    )
}

const MaskGenerator = () => {
    const [showModal, setShowModal] = useState(false);
    
    const handleShowModal = () => {
        setShowModal(true)
    }

    return (
        <div onDoubleClick={handleShowModal}>
            <div> test </div>
            <Modal title='Mask Generator' open={showModal} onClose={() => setShowModal(!showModal)}>
                <MaskGeneratorView></MaskGeneratorView>
            </Modal>
        </div>
    )
}

export default MaskGenerator;