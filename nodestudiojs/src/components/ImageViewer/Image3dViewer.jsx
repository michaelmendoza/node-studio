import './Image3dViewer.scss';
import { useRef, useState, useEffect } from 'react';
import ImageSimpleRenderer from './ImageSimpleRenderer';
import { useWindowSize } from '../../hooks/useWindowSize';

const ImageSliceViewer = ({ node, slicetype = 'transverse', position, setPosition, positionSize, colMap }) => {
    const viewerRef = useRef(null);
    const [canDrag, setCanDrag] = useState(false);
        
    const slice = { 'transverse': 'xy', 'coronal': 'xz', 'sagittal': 'yz' };

    const color = {'transverse': ['green', 'purple'], 'coronal': ['yellow', 'purple'], 'sagittal': ['yellow', 'green'] };

    const style = { 
        'transverse': [{ width: positionSize.x, height: positionSize.y }, { top:position.y, width: positionSize.x }, { left:position.x }],
        'coronal': [{ width : positionSize.x , height : positionSize.z }, { top:position.z, width: positionSize.x}, { left:position.x }],
        'sagittal': [{ width: positionSize.y, height: positionSize.z }, { top:position.z, width: positionSize.y }, { left:position.y }]
    }; 

    const handleMouseDown = (e) => { e.preventDefault(); setCanDrag(true); }

    const handleMouseUp = (e) => { e.preventDefault(); setCanDrag(false); }

    const handleMouseLeave = (e) => { e.preventDefault(); setCanDrag(false); }

    const handleMouseMove = (e) => {
        e.preventDefault();
        if(!canDrag) return;

        var rect = viewerRef.current.getBoundingClientRect();
        let x = Math.round(e.pageX - rect.left);
        let y = Math.round(e.pageY - rect.top);

        y = y < 0 ? 0 : y
        y = y > viewerRef.current.clientHeight ? viewerRef.current.clientHeight : y
        x = x < 0 ? 0 : x
        x = x > viewerRef.current.clientWidth ? viewerRef.current.clientWidth : x

        let _position;
        if (slicetype === 'transverse') _position = { x, y, z: position.z };
        if (slicetype === 'coronal') _position = { x:x, y: position.y, z:y };
        if (slicetype === 'sagittal') _position = { x:position.x, y:x, z:y };
        setPosition(_position);

        const maxIndex = node.view.shape.map((s) => s - 1);
        const idx =  Math.floor(_position.x / positionSize.x * maxIndex[2]); // transverse - xy
        const idy = Math.floor(_position.y / positionSize.y * maxIndex[1]); // coronal - xz
        const idz = Math.floor(_position.z / positionSize.z * maxIndex[0]); // sagittal - yz
        node.view.updateIndex3d(idx, idy, idz);
    }    

    const updateIndex = (new_index) => {
        const shapeIndex = ({ 'transverse':0, 'coronal':1, 'sagittal':2 })[slicetype];
        const fractional_index = new_index / node.view.shape[shapeIndex];
        let x = (slicetype === 'sagittal') ? fractional_index * positionSize.x : position.x;
        let y = (slicetype === 'coronal') ? fractional_index * positionSize.y : position.y;
        let z = (slicetype === 'transverse') ? fractional_index * positionSize.z : position.z;
        setPosition({ x, y, z });
    }

    return (
        <div className='image-slice-viewer'>
            <div style={style[slicetype][0]} ref={viewerRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <ImageSimpleRenderer node={node} slice={slice[slicetype]} colormap={colMap} updateIndex={updateIndex}></ImageSimpleRenderer>
              <div className={'drag-handle-viewable-h-' + color[slicetype][0]} style={style[slicetype][1]} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}> 
                <div className='drag-handle-dragable-h'></div>
              </div>  
              <div className={'drag-handle-viewable-v-' + color[slicetype][1]} style={style[slicetype][2]} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}> 
                <div className='drag-handle-dragable-v'></div>
              </div>  
            </div>
        </div>
      );
}

const Image3dViewer = ({ node, colMap }) => {
    const viewerRef = useRef(null);
    const size = useWindowSize();
    const [isInit, setInit] = useState(false);
    const [positionSize, setPositionSize] = useState(); //less than 300
    const [position, setPosition] = useState();

    useEffect(() => {
        const fetch = async () => {
            const size = await init();
            setPositionSize(size);
            setPosition({ x:size.x / 2, y:size.y / 2, z:size.z / 2 });
            setInit(true);
         }
        fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [size])

    const init = async () => {
        if(!node.view.hasData) return { x:200, y:200, z:200 }
    
        let x = node.view.shape[2]; 
        let y = node.view.shape[1];
        let z = node.view.shape[0];
    
        var maxImgDim = 0;
        if (x >= y && x >= z){ maxImgDim = x; }
        else if (y >= x && y >= z) { maxImgDim = y; }
        else maxImgDim = z;
    
        const vWidth = viewerRef.current.clientWidth * .3333 - 24;
        x = vWidth / maxImgDim * x;
        y = vWidth / maxImgDim * y;
        z = vWidth / maxImgDim * z;

        return { x, y, z }
    }

    return (
        <div className='image-3d-viewer' ref={viewerRef}> 
            { isInit ? <div className='layout-row'>
                <div style={{padding: '1em'}}>
                    <h2>Transverse</h2>
                    <ImageSliceViewer node={node} slicetype = 'transverse' position = {position} setPosition = {setPosition} positionSize = {positionSize} colMap = {colMap}></ImageSliceViewer> 
                </div>
                <div style={{padding: '1em'}}>
                    <h2>Coronal</h2>
                    <ImageSliceViewer node={node} slicetype = 'coronal' position = {position} setPosition = {setPosition} positionSize = {positionSize} colMap = {colMap}></ImageSliceViewer>
                </div>
                <div style={{padding: '1em'}}>
                    <h2>Saggital</h2>
                    <ImageSliceViewer node={node} slicetype = 'sagittal' position = {position} setPosition = {setPosition} positionSize = {positionSize} colMap = {colMap}></ImageSliceViewer>
                </div>
            </div> : null
            }
        </div>
    );
  }

export default Image3dViewer;