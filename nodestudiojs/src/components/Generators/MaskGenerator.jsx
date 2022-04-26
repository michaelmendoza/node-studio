import './MaskGenerator.scss';
import { useState, useEffect } from 'react';
import { DrawImg } from '../../libraries/draw/Draw';
import Modal from '../base/Modal';
import ImageMultiLayerRenderer from '../graph/ImageMultiLayerRenderer';

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

const updateMaskPixels = (dataset, position, value, brush) => {
    const width = dataset.shape[1];

    if(brush === 1) {
        dataset.pixelArray[width * position.y + position.x] = value;
    }
    if(brush >= 2) {
        for (let i = 0; i < brush * brush; i++) {
            const x = position.x + i % brush;
            const y = width * (position.y + Math.floor(i / brush));
            dataset.pixelArray[x + y] = value;
        }
    }

    return dataset;
}

const MaskGeneratorView = ({nodeID}) => {

    const [width, setWidth] = useState(64);
    const [height, setHeight] = useState(64);
    const [position, setPosition] = useState({ x:0, y:0 });
    const [dataset, setDataset] = useState(zerosMask())
    const [imageData, setImageData] = useState(null);
    const [drawMask, setDrawMask] = useState(false);
    
    const [brush, setBrush] = useState(1);
    const [maskValue, setMaskValue] = useState(1);

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = () => {
        const dataUri = DrawImg(dataset);
        setImageData(dataUri)
    }

    const handleMouseDown = () => {
        setDrawMask(true);
    }

    const handleMouseUp = (e) => {
        setDrawMask(false);
        updateMask(e);
    }

    const handleHover = (e) => {
        updateMask(e);
    }

    const updateMask = (e) => {
        var sx = e.target.width / width;
        var sy = e.target.height / height;
        var rect = e.target.getBoundingClientRect();
        var x = Math.floor((e.clientX - rect.left) / sx); // x position within the element.
        var y = Math.floor((e.clientY - rect.top) / sy);  // y position within the element.
        setPosition({ x, y });

        if(drawMask) {
            const dataUri = DrawImg(updateMaskPixels(dataset, { x, y }, maskValue, brush))
            setImageData(dataUri)
        }
    }

    return (
        <div className='mask-generator-view'>
            <div className='layout-row-center layout-space-between'>
                <div>
                    <button className='button-icon' onClick={() => setMaskValue(1)}><span className="material-icons"> mode_edit </span></button>
                    <button className='button-icon' onClick={() => setMaskValue(0)}><span className="material-icons"> mode_edit </span></button>
                </div>

                <div>
                    <button className='button-icon' onClick={() => setBrush(1)}><i className="material-icons"> looks_one </i></button>
                    <button className='button-icon' onClick={() => setBrush(2)}><i className="material-icons"> looks_two </i></button>
                    <button className='button-icon' onClick={() => setBrush(3)}><i className="material-icons"> looks_3 </i></button>
                </div>

                <div className='position-output'> (x: {position.x}, y: {position.y}) </div>
            </div>
            <div onMouseMove={handleHover} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
                <img src={imageData} style={{ width:'100%' }}  draggable="false" alt='mask'/> 
                <ImageMultiLayerRenderer nodeID={nodeID} slice='xy' index={70}></ImageMultiLayerRenderer>
            </div>
        </div>
    )
}

const MaskGenerator = ({nodeID}) => {
    const [showModal, setShowModal] = useState(false);
    
    const handleShowModal = () => {
        setShowModal(true)
    }

    return (
        <div>
            <div> <button onClick={handleShowModal}> Generate Mask</button> </div>
            <Modal title='Mask Generator' open={showModal} onClose={() => setShowModal(!showModal)}>
                <MaskGeneratorView nodeID={nodeID}></MaskGeneratorView>
            </Modal>
        </div>
    )
}

export default MaskGenerator;