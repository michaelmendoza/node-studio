import { useRef, useState } from 'react';
import './viewer3d.scss';


const Transverse = ({position, setPosition, picturesize}) => {
  const viewerRef = useRef(null);

  const [canDrag, setCanDrag] = useState(false);
  

  const handleMouseDown = (e) => {
    e.preventDefault();
    setCanDrag(true)
  }

  const handleMouseUp = (e) => {
    e.preventDefault();
    setCanDrag(false)
  }

  const handleMouseLeave = (e) => {
    e.preventDefault();
    setCanDrag(false)
  }

  const handleMouseMove = (e) => {
    e.preventDefault();
    if(!canDrag) return;

    var rect = viewerRef.current.getBoundingClientRect();

    let x = Math.round(e.pageX - rect.left);
    let y = Math.round(e.pageY - rect.top );
    let z = position.z

    y = y < 0 ? 0 : y
    y = y > viewerRef.current.clientHeight ? viewerRef.current.clientHeight : y
    x = x < 0 ? 0 : x
    x = x > viewerRef.current.clientWidth ? viewerRef.current.clientWidth : x
    setPosition({ x, y, z})
   
  }

  return (

    <div className='viewer-3d'>

        <div className='viewer-continer' style={{ width: picturesize.x, height: picturesize.y}} ref={viewerRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
          <div className='drag-handle-viewable-h-green' style={{ top:position.y, width: picturesize.x}} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}> 
            <div className='drag-handle-dragable-h'></div>
          </div>  
          <div className='drag-handle-viewable-v-purple' style={{ left:position.x }} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}> 
            <div className='drag-handle-dragable-v'></div>
          </div>  
        </div>
      
    </div>
  );
}



export default Transverse;
