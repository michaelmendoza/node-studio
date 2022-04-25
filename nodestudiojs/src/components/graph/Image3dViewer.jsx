import '../base/components/viewer3d.scss';
import { useRef, useState } from 'react';
import ImageRender from './ImageSimpleRenderer';

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
        'transverse': position.z/picturesize.z, 
        'coronal': position.y/picturesize.y, 
        'sagittal': position.x/picturesize.x
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
            setPosition({ x, y, z});
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
        <div className='viewer-3d'>
    
            <div className='viewer-continer' style={style[slicetype][0]} ref={viewerRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
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

const Image3dViewer = ({nodeID, dataset, colMap, intensity, setIntensity}) =>{
  
    var pic_x = 200;
    var pic_y = 200;
    var pic_z = 200;

    if(dataset!=null){
      pic_x = dataset.fullshape[2];
      pic_y = dataset.fullshape[1];
      pic_z = dataset.fullshape[0];
    }

    var ratio = 1;
    var maxImgDim = 0;
    if (pic_x >= pic_y&&pic_x >= pic_z){
      maxImgDim = pic_x;
    }
    else if (pic_y >= pic_x&& pic_y >= pic_z){
      maxImgDim = pic_y;
    }
    else maxImgDim = pic_z;

    ratio = 300/maxImgDim;
    pic_x = ratio*pic_x;
    pic_y = ratio*pic_y;
    pic_z = ratio*pic_z;
    const [picturesize, setPicsize] = useState({  x:pic_x, y:pic_y, z:pic_z })//less than 300
    const [position, setPosition] = useState({ x:picturesize.x/2, y:picturesize.y/2, z:picturesize.z/2 })

    return (
      <div className = 'wrapper'>
        <h2>Transverse</h2>
        <h2>Coronal</h2>
        <h2>Saggital</h2>
        <div>
          <ImageSliceViewer slicetype = 'transverse' position = {position} setPosition = {setPosition} picturesize = {picturesize} nodeID = {nodeID} colMap = {colMap}></ImageSliceViewer> 
        </div>
        <div>
          <ImageSliceViewer slicetype = 'coronal' position = {position} setPosition = {setPosition} picturesize = {picturesize} nodeID = {nodeID} colMap = {colMap}  intensity={intensity} setIntensity={setIntensity}></ImageSliceViewer>
        </div>
        <div>
          <ImageSliceViewer slicetype = 'sagittal' position = {position} setPosition = {setPosition} picturesize = {picturesize} nodeID = {nodeID} colMap = {colMap} ></ImageSliceViewer>
        </div>
        <div className='box1'>
        ({(position.x/picturesize.x).toFixed(2)}, {(position.y/picturesize.y).toFixed(2)}, {(position.z/picturesize.z).toFixed(2)})
        </div>
      </div>
      
    );
  }

export default Image3dViewer;