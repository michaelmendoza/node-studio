import './Image3dViewer.scss';
import { useRef, useState, useEffect } from 'react';
import ImageRender from './ImageSimpleRenderer';
import APIDataService from '../../services/APIDataService';
import { useWindowSize } from '../../hooks/useWindowSize';

const ImageSliceViewer = ({ nodeID, slicetype = 'transverse', position, setPosition, picturesize, colMap }) => {
    const viewerRef = useRef(null);
    const [canDrag, setCanDrag] = useState(false);
    
    const slice = {
        'transverse': 'xy', 
        'coronal': 'xz', 
        'sagittal': 'yz'
    };

    const style = { 
        'transverse': [{ width: picturesize.x, height: picturesize.y }, { top:position.y, width: picturesize.x }, { left:position.x }],
        'coronal': [{ width : picturesize.x , height : picturesize.z }, { top:position.z, width: picturesize.x}, { left:position.x }],
        'sagittal': [{ width: picturesize.y, height: picturesize.z }, { top:position.z, width: picturesize.y }, { left:picturesize.y-position.y }]
    }; 

    const color = {
        'transverse': ['green', 'purple'], 
        'coronal': ['yellow', 'purple'], 
        'sagittal': ['yellow', 'green']
    };

    const index = {
        'transverse': position.z / picturesize.z, 
        'coronal': position.y / picturesize.y, 
        'sagittal': position.x / picturesize.x
    };

    const handleMouseDown = (e) => { e.preventDefault(); setCanDrag(true); }
  
    const handleMouseUp = (e) => { e.preventDefault(); setCanDrag(false); }
  
    const handleMouseLeave = (e) => { e.preventDefault(); setCanDrag(false); }
  
    const handleMouseMove = (e) => {
        e.preventDefault();
        if(!canDrag) return;

        var rect = viewerRef.current.getBoundingClientRect();

        if (slicetype === 'transverse') {
            let x = Math.round(e.pageX - rect.left);
            let y = Math.round(e.pageY - rect.top );
            let z = position.z

            y = y < 0 ? 0 : y
            y = y > viewerRef.current.clientHeight ? viewerRef.current.clientHeight : y
            x = x < 0 ? 0 : x
            x = x > viewerRef.current.clientWidth ? viewerRef.current.clientWidth : x
            setPosition({ x, y, z });
        }
        if (slicetype === 'coronal') {
            let x = Math.round(e.pageX - rect.left);
            let y = position.y
            let z = Math.round(e.pageY - rect.top );
        
            z = z < 0 ? 0 : z
            z = z > viewerRef.current.clientHeight ? viewerRef.current.clientHeight : z
            x = x < 0 ? 0 : x
            x = x > viewerRef.current.clientWidth ? viewerRef.current.clientWidth : x
            setPosition({ x, y, z })
        }
        if (slicetype === 'sagittal') {
            let x = position.x
            let y = Math.round(rect.right - e.pageX );
            let z = Math.round(e.pageY - rect.top );
        
            z = z < 0 ? 0 : z
            z = z > viewerRef.current.clientHeight ? viewerRef.current.clientHeight : z
            y = y < 0 ? 0 : y
            y = y > viewerRef.current.clientWidth ? viewerRef.current.clientWidth : y
            setPosition({ x, y, z })
        }
     
    }    

    return (
        <div className='image-slice-viewer'>
            <div style={style[slicetype][0]} ref={viewerRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <ImageRender slice={slice[slicetype]} index={index[slicetype]} colormap={colMap} nodeID={nodeID}></ImageRender>
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

const Image3dViewer = ({nodeID, colMap, intensity, setIntensity}) =>{
    const viewerRef = useRef(null);
    const size = useWindowSize();

    const [isInit, setInit] = useState(false);
    const [picturesize, setPicsize] = useState(); //less than 300
    const [position, setPosition] = useState();

    useEffect(() => {
        const fetch = async () => {
            const picSize = await init();
            setPicsize(picSize);
            setPosition({ x:picSize.x / 2, y:picSize.y / 2, z:picSize.z / 2 });
            setInit(true);
         }
        fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [size])

    const init = async () => {
        const metadata = await APIDataService.getNodeMetadata(nodeID);
        if(metadata === null) return {  x:200, y:200, z:200 }
    
        let x = metadata.fullshape[2];
        let y = metadata.fullshape[1];
        let z = metadata.fullshape[0];
    
        var maxImgDim = 0;
        if (x >= y && x >= z){ maxImgDim = x; }
        else if (y >= x && y >= z) { maxImgDim = y; }
        else maxImgDim = z;
    
        const vWidth = viewerRef.current.clientWidth * .3333 - 24;
        x = vWidth / maxImgDim * x;
        y = vWidth / maxImgDim * y;
        z = vWidth / maxImgDim * z;

        return { x:x, y:y, z:z }
    }

    return (
        <div className='image-3d-viewer' ref={viewerRef}> 
            { isInit ? <div className='layout-row'>
                <div style={{padding: '1em'}}>
                    <h2>Transverse</h2>
                    <ImageSliceViewer slicetype = 'transverse' position = {position} setPosition = {setPosition} picturesize = {picturesize} nodeID = {nodeID} colMap = {colMap}></ImageSliceViewer> 
                </div>
                <div style={{padding: '1em'}}>
                    <h2>Coronal</h2>
                    <ImageSliceViewer slicetype = 'coronal' position = {position} setPosition = {setPosition} picturesize = {picturesize} nodeID = {nodeID} colMap = {colMap}  intensity={intensity} setIntensity={setIntensity}></ImageSliceViewer>
                </div>
                <div style={{padding: '1em'}}>
                    <h2>Saggital</h2>
                    <ImageSliceViewer slicetype = 'sagittal' position = {position} setPosition = {setPosition} picturesize = {picturesize} nodeID = {nodeID} colMap = {colMap} ></ImageSliceViewer>
                </div>
            </div> : null
            }
        </div>
    );
  }

export default Image3dViewer;