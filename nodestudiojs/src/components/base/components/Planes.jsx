import { useRef, useState } from 'react';
import Transverse from './Transverse';
import Coronal from './Coronal';
import Sagittal from './Sagittal';


const Planes = () =>{
    var pic_x = 300;
    var pic_y = 200;
    var pic_z = 200;
    var ratio = 1;
    var maxImgDim = 0;
    if (pic_x >= pic_y&&pic_x >= pic_z){
      maxImgDim = pic_x;
    }
    else if (pic_y >= pic_x&& pic_y >= pic_z){
      maxImgDim = pic_y;
    }
    else maxImgDim = pic_z;
    //const imgDim = [pic_x,pic_y,pic_z];
    //maxImgDim = Math.max(imgDim);
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
        <h2 >Saggital</h2>
        <div>
          <Transverse position = {position} setPosition = {setPosition} picturesize = {picturesize}></Transverse> 
        </div>
        <div>
          <Coronal position = {position} setPosition = {setPosition} picturesize = {picturesize} setPicsize = {setPicsize}></Coronal>
        </div>
        <div>
          <Sagittal position = {position} setPosition = {setPosition} picturesize = {picturesize}></Sagittal>
        </div>
        <div className='box1'>
        ({(position.x/picturesize.x).toFixed(2)}, {(position.y/picturesize.y).toFixed(2)}, {(position.z/picturesize.z).toFixed(2)})
        </div>
      </div>
      
    );
  }
  export default Planes;